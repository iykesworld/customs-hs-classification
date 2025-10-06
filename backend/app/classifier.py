import os
import json
from openai import OpenAI, APIError
from pydantic import ValidationError
from dotenv import load_dotenv


load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))


from .data import ClassificationResponse, SYSTEM_PROMPT_REFERENCE


try:
    client = OpenAI()
except Exception as e:
    
    print(f"Error initializing OpenAI client: {e}")
    client = None


def classify_product(product_description: str) -> dict:
    """
    Uses the OpenAI API to predict the top 3 HS Codes for a given product description,
    enforcing a Pydantic structure for the output.
    
    FIX: Removed the explicit 'schema' key from response_format to resolve the 400 API error.
    The Pydantic schema is now injected into the system prompt for instruction and validated post-call.
    """
    if not client:
        return {"error": "OpenAI client is not initialized. Check API Key.", "data": {}}

    # We use the pydantic schema to instruct the model on the required output format
    response_schema = ClassificationResponse.model_json_schema()
    
    # Inject the required JSON schema structure into the system prompt for better model adherence
    # This is critical for reliable structured output when not using the 'schema' parameter directly
    enhanced_system_prompt = (
        SYSTEM_PROMPT_REFERENCE + 
        "\n\nYOUR RESPONSE MUST BE a single JSON object STRICTLY matching this schema:\n" +
        json.dumps(response_schema, indent=2)
    )

    # The user's input will be passed as a user message
    user_message = f"COMMERCIAL DESCRIPTION TO CLASSIFY: '{product_description}'"

    try:
        # 1. Call the OpenAI Chat Completions endpoint
        response = client.chat.completions.create(
            model="gpt-4o-mini", # Using gpt-4o-mini for fast, cost-effective, and excellent JSON output
            messages=[
                {"role": "system", "content": enhanced_system_prompt},
                {"role": "user", "content": user_message},
            ],
            # 2. Key for structured output: We only specify the type is JSON object (The FIX)
            response_format={"type": "json_object"},
            temperature=0.1 # Low temperature for more deterministic classification
        )

        # 3. Extract the JSON string from the response
        json_output_string = response.choices[0].message.content.strip()

        # 4. Validate the JSON output against the Pydantic model (Essential for robustness)
        llm_data = json.loads(json_output_string)
        validated_data = ClassificationResponse.model_validate(llm_data)

        # Convert Pydantic object back to a standard dictionary for the API response
        return {"error": None, "data": validated_data.model_dump()}

    except APIError as e:
        # Catch errors related to the OpenAI API call
        print(f"OpenAI API Error: {e}")
        return {"error": f"API Error: {e.status_code} - {e.message}", "data": {}}
    except (json.JSONDecodeError, ValidationError) as e:
        # Catch errors if the LLM fails to return the exact JSON format
        print(f"Output Validation Error: {e}")
        return {"error": "AI classification failed due to invalid output format.", "data": {}}
    except Exception as e:
        # Catch all other unexpected errors
        print(f"An unexpected error occurred: {e}")
        return {"error": f"An unexpected error occurred: {str(e)}", "data": {}}
