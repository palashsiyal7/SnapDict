# # app/services/ocr.py
# from PIL import Image
# import pytesseract
# import io

# def process_image_file(image_content: bytes) -> str:
#     """Process image file and return extracted text."""
#     try:
#         # Open the image
#         img = Image.open(io.BytesIO(image_content))

#          # For MPO files, ensure we're using the first frame
#         if getattr(img, "is_animated", False) and img.format == "MPO":
#             img.seek(0)
        
#         # Convert image to RGB mode if it's not
#         if img.mode != 'RGB':
#             img = img.convert('RGB')
            
#         # Perform OCR
#         text = pytesseract.image_to_string(img)
        
#         return text.strip()
#     except Exception as e:
#         raise ValueError(f"Error processing image: {str(e)}")

from PIL import Image
import pytesseract
import io

def process_image_file(image_content: bytes) -> str:
    """Process image file and return extracted text."""
    try:
        # Open the image from in-memory bytes
        img = Image.open(io.BytesIO(image_content))

        # If it's an MPO (animated) file, select the first frame
        if getattr(img, "is_animated", False) and img.format == "MPO":
            img.seek(0)

        # Convert image to RGB if it's not already
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Optional: If you're still having format issues, convert to JPEG in-memory
        # output = io.BytesIO()
        # img.save(output, format="JPEG")
        # output.seek(0)
        # img = Image.open(output)

        # Perform OCR
        text = pytesseract.image_to_string(img)

        return text.strip()
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")
