# app/config.py
import nltk

class Settings:
    PROJECT_NAME = "SnapDict"
    PROJECT_VERSION = "1.0.0"
    API_V1_STR = "/api/v1"
    PORT = 8000
    
def initialize_nltk():
    try:
        # Download required NLTK data
        nltk.download('punkt', quiet=True)
        nltk.download('averaged_perceptron_tagger', quiet=True)
        nltk.download('wordnet', quiet=True)
        print("NLTK data downloaded successfully")
    except Exception as e:
        print(f"Error downloading NLTK data: {e}")
        raise  # Re-raise the exception to prevent silent failures

# Initialize NLTK when config is imported
initialize_nltk()
settings = Settings()
