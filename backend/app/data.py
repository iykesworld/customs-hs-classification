from pydantic import BaseModel, Field
from typing import List

# --- 1. Pydantic Schema for LLM Output ---
# This defines the exact JSON structure we expect from the OpenAI model.
class ClassificationResult(BaseModel):
    """Defines the structure for a single predicted HS Code."""
    hs_code: str = Field(..., description="The predicted 4-digit HS code (e.g., 8471).")
    description: str = Field(..., description="A brief description corresponding to the HS code.")
    confidence_score: float = Field(..., description="A confidence score from 0.0 to 1.0 representing the prediction certainty.")

class ClassificationResponse(BaseModel):
    """Defines the structure for the final API response."""
    predictions: List[ClassificationResult] = Field(
        ...,
        description="A list of up to 3 most likely HS Code predictions, sorted by confidence score."
    )

# --- 2. Mock HS Code Reference Data ---
# A small, focused list of 4-digit codes relevant to a customs environment.
MOCK_HS_CODE_REFERENCE = {
    "8471": "Automatic data processing machines and units thereof.",
    "8473": "Parts and accessories for machinery of heading 8471.",
    "9018": "Instruments and appliances used in medical, surgical or dental sciences.",
    "3926": "Other articles of plastics and articles of other materials of headings 3901 to 3925.",
    "6103": "Men's or boys' suits, ensembles, jackets, blazers, trousers, etc. (knitted or crocheted).",
    "7323": "Table, kitchen or other household articles and parts thereof, of iron or steel.",
    "8517": "Telephone sets, including telephones for cellular networks or for other wireless networks; other apparatus for the transmission or reception of voice, images or other data.",
    "9503": "Tricycles, scooters, pedal cars and similar wheeled toys; dolls' carriages; dolls; other toys.",
}

# --- 3. System Prompt Component ---
# This provides the LLM with the context it needs.
SYSTEM_PROMPT_REFERENCE = (
    "You are an expert Customs and Trade Classification Assistant. Your task is to accurately classify a commercial "
    "product description to its most likely 4-digit Harmonized System (HS) Code. You MUST use the provided HS CODE "
    "REFERENCE LIST to make your predictions. If the description is a clear match, provide a high confidence score. "
    "If it's ambiguous, provide lower scores and select the best three possible options from the list. "
    "The reference codes are:\n"
)

# Append the mock data to the prompt string
for code, desc in MOCK_HS_CODE_REFERENCE.items():
    SYSTEM_PROMPT_REFERENCE += f"- HS {code}: {desc}\n"