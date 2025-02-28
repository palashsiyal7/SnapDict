# app/config.py
import nltk
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Settings:
    PROJECT_NAME = "SnapDict"
    PROJECT_VERSION = "1.0.0"
    API_V1_STR = "/api/v1"
    PORT = 8000
    
def initialize_nltk():
    """Download all required NLTK resources if they don't exist."""
    # Define the required NLTK resources
    required_resources = [
        'punkt',              # For tokenization
        'punkt_tab',          # For additional tokenization data
        'wordnet',            # For word definitions and synonyms
        'stopwords',          # For filtering common words
        'averaged_perceptron_tagger',  # For part-of-speech tagging
        'averaged_perceptron_tagger_eng',  # English specific tagger
        'omw-1.4'             # Open Multilingual WordNet
    ]
    
    # Create data directory if it doesn't exist
    nltk_data_dir = os.path.expanduser('~/nltk_data')
    os.makedirs(nltk_data_dir, exist_ok=True)
    
    # Download each required resource
    for resource in required_resources:
        try:
            # Check if resource exists before downloading
            if not nltk.data.find(resource):
                logger.info(f"Downloading NLTK resource: {resource}")
                nltk.download(resource, quiet=True)
        except LookupError:
            # Resource doesn't exist, download it
            logger.info(f"Resource not found. Downloading NLTK resource: {resource}")
            nltk.download(resource, quiet=True)
        except Exception as e:
            logger.error(f"Error checking/downloading NLTK resource {resource}: {e}")
            raise
    
    logger.info("All required NLTK resources are available")

# Initialize NLTK when config is imported
initialize_nltk()
settings = Settings()
