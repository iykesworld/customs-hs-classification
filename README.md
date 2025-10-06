Customs AI Classification Assistant: Bridging Data Science and Border SecurityThis project demonstrates the application of cutting-edge Artificial Intelligence (AI) and full-stack development to solve a critical operational challenge for the Nigeria Customs Service (NCS): Accurate and efficient Harmonized System (HS) Code classification of imported and exported goods.Built as a proof-of-concept for the Superintendent Cadre (Support Staff - Computer Programmer) recruitment process, this application showcases proficiency in Python, JavaScript/React, structured AI output, and modern API integration.🎯 Problem & SolutionFeatureChallenge AddressedValue to NCSHS Code PredictionManual classification is slow, prone to human error, and inconsistent, leading to revenue loss and trade delays.Automates up to 80% of classification decisions for common goods, improving speed and accuracy.Confidence ScoringDecision-makers need to know when to trust the AI result versus when manual verification is required.Provides a real-time risk score, allowing customs officers to prioritize ambiguous declarations for physical review.Structured AI OutputEnsuring the AI's output (HS Code, Description, Score) is consistently formatted for use in official systems.Demonstrates robust data engineering practices using Pydantic for guaranteed data integrity and reliability.🛠️ Technical StackFrontend: Next.js (React) with TypeScript and Tailwind CSS (ShadCN/UI components).Demonstrates proficiency in modern web frameworks and responsive UI design.Backend & AI Core: Python (Flask)Provides a lightweight, scalable API layer for handling frontend requests.AI Engine: OpenAI API (gpt-4o-mini)Leveraged for its structured JSON output capabilities, focusing on prompt engineering to enforce classification rules.Data Structure: PydanticUsed to define and validate the exact JSON schema required for classification results, ensuring data consistency between Python and TypeScript.🚀 Getting Started (Local Setup)The project is structured as a mono-repository with separate backend (Python Flask) and frontend (Next.js) applications.1. Backend Setup (Python)Navigate to the backend/ directory, activate your virtual environment (e.g., using uv venv and source .venv/bin/activate), and install dependencies:# 1. Install dependencies (Flask, OpenAI, Pydantic)
pip install -r requirements.txt

# 2. Add your API Key
# Create a .env file in backend/ and add:
# OPENAI_API_KEY="sk-..."

# 3. Run the API server
python run.py
# Server runs on: [http://127.0.0.1:5000](http://127.0.0.1:5000)
2. Frontend Setup (Next.js)Navigate to the frontend/ directory and install Node dependencies:# 1. Install dependencies
npm install --force

# 2. Set API URL
# Create a .env.local file in frontend/ and add:
# NEXT_PUBLIC_API_URL=[http://127.0.0.1:5000](http://127.0.0.1:5000)

# 3. Run the Next.js development server
npm run dev
# Server typically runs on: http://localhost:3000
💡 Demonstration StepsEnsure both the Python API (:5000) and the Next.js app (:3000) are running.Navigate to the frontend in your browser.Enter a sample product description related to the mock data (e.g., "Portable digital computing machine, 13-inch screen") and click Classify Product.The application will display the predicted 4-digit HS Codes, corresponding descriptions (e.g., 8471), and the AI's confidence score, showcasing real-time data flow and AI integration.