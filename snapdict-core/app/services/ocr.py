# ocr.py
from PIL import Image, ImageEnhance
import pytesseract
import io
import logging
import numpy as np
import cv2

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def preprocess_image(img):
    """Apply targeted preprocessing for faster OCR with good accuracy."""
    # Convert to OpenCV format
    img_np = np.array(img)
    
    # Convert to grayscale if it's not already
    if len(img_np.shape) == 3 and img_np.shape[2] == 3:
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    else:
        gray = img_np
    
    # Apply Gaussian blur to reduce noise - reduced kernel size for speed
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    
    # Apply simple binary thresholding (faster than adaptive)
    _, threshold = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Convert back to PIL format
    processed_img = Image.fromarray(threshold)
    
    return processed_img

def process_image_file(image_content: bytes) -> str:
    """Optimized version that processes image file and returns extracted text."""
    try:
        # Open the image from in-memory bytes
        img = Image.open(io.BytesIO(image_content))
        logger.info(f"Processing image: format={img.format}, size={img.size}, mode={img.mode}")

        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Reduce the maximum dimension further for faster processing
        max_dimension = 1500  # Reduced from 2000
        if max(img.size) > max_dimension:
            # Calculate new dimensions while maintaining aspect ratio
            width, height = img.size
            if width > height:
                new_width = max_dimension
                new_height = int(height * (max_dimension / width))
            else:
                new_height = max_dimension
                new_width = int(width * (max_dimension / height))
            
            img = img.resize((new_width, new_height), Image.LANCZOS)
            logger.info(f"Resized image to {new_width}x{new_height}")

        # Basic enhancement - reduced for speed
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.3)  # Slight contrast enhancement
        
        # Process the image
        processed_img = preprocess_image(img)
        
        # Use a single optimized OCR call with a fast configuration
        custom_config = r'--oem 1 --psm 6'  # Using legacy engine (faster) with block mode
        text = pytesseract.image_to_string(processed_img, config=custom_config)
        
        return text.strip()
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise ValueError(f"Error processing image: {str(e)}")
