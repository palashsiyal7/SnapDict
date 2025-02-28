# app/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time
import hashlib
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from functools import lru_cache

from .config import initialize_nltk, settings
from .services import ocr, word_processing

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Image processing cache - stores results to avoid reprocessing the same image
image_cache = {}

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize NLTK data
initialize_nltk()

class WordInfo(BaseModel):
    definition: str
    example: Optional[str] = Field(default="")
    pos: Optional[str] = Field(default="")
    synonyms: List[str] = Field(default_factory=list)
    antonyms: List[str] = Field(default_factory=list)

class ProcessingResult(BaseModel):
    complex_words: Dict[str, WordInfo]
    original_text: str
    processing_time: float

def get_image_hash(image_content):
    """Generate a hash for image content to use as cache key."""
    return hashlib.md5(image_content).hexdigest()

@app.post(f"{settings.API_V1_STR}/process-image", response_model=ProcessingResult)
async def process_image(image: UploadFile):
    """
    Process an image to extract text and identify complex words.
    
    Returns enhanced definitions and contextual information.
    """
    start_time = time.time()
    logger.info(f"Processing image: {image.filename}")
    
    # Validate file type
    if not image.content_type.startswith('image/'):
        logger.warning(f"Invalid file type: {image.content_type}")
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")
        
    try:
        # Read image content
        image_content = await image.read()
        
        # Check if we have processed this image before
        image_hash = get_image_hash(image_content)
        if image_hash in image_cache:
            logger.info("Using cached result for this image")
            cached_result = image_cache[image_hash]
            # Update processing time to include cache lookup
            cached_result["processing_time"] = round(time.time() - start_time, 2)
            return cached_result
        
        # Extract text from image
        logger.info("Extracting text from image")
        text = ocr.process_image_file(image_content)
        
        if not text:
            logger.warning("No text could be extracted from the image")
            raise HTTPException(status_code=400, detail="No text could be extracted from the image")
            
        # Process extracted text to find complex words
        logger.info("Processing text to identify complex words")
        complex_words = word_processing.extract_complex_words(text)
        
        if not complex_words:
            logger.info("No complex words found in the text")
        else:
            logger.info(f"Found {len(complex_words)} complex words")
            
        # Calculate processing time
        processing_time = time.time() - start_time
        logger.info(f"Processing completed in {processing_time:.2f} seconds")
        
        # Prepare result
        result = {
            "complex_words": complex_words,
            "original_text": text,
            "processing_time": round(processing_time, 2)
        }
        
        # Cache the result for future requests
        image_cache[image_hash] = result
        
        # Return results
        return result
        
    except ValueError as e:
        logger.error(f"Value error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while processing the image")

@app.get("/health")
async def health_check():
    """Health check endpoint to verify API is running"""
    return {"status": "healthy", "version": settings.PROJECT_VERSION}
