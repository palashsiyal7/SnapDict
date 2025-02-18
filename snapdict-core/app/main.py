# app/main.py
from fastapi import FastAPI, UploadFile, File
from .config import initialize_nltk, settings
from .services import ocr, word_processing

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION
)

# Initialize NLTK data
initialize_nltk()

@app.post(f"{settings.API_V1_STR}/process-image")
async def process_image(image: UploadFile = File(...)):
    # Validate file type
    if not image.content_type.startswith('image/'):
        return {
            "error": "Uploaded file must be an image"
        }, 400
        
    try:
        image_content = await image.read()
        text = ocr.process_image_file(image_content)
        
        if not text:
            return {
                "error": "No text could be extracted from the image"
            }, 400
            
        complex_words = {}
        for word in text.split():
            word = word.strip().lower()
            if word_processing.is_complex_word(word):
                definition = word_processing.get_word_definition(word)
                if definition:
                    complex_words[word] = definition
        
        return {
            "complex_words": complex_words,
            "original_text": text
        }
        
    except ValueError as e:
        return {
            "error": str(e)
        }, 400
    except Exception as e:
        return {
            "error": "An unexpected error occurred while processing the image"
        }, 500