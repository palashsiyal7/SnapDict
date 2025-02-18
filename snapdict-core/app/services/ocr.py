from PIL import Image
import pytesseract
import io

def process_image_file(image_content: bytes) -> str:
    """Process image file and return extracted text."""
    try:
        # Open the image from in-memory bytes
        img = Image.open(io.BytesIO(image_content))

        # If it's an MPO (multi-frame) image, select the first frame
        if getattr(img, "is_animated", False) and img.format == "MPO":
            img.seek(0)

        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Convert the image to a standard JPEG in-memory to avoid format quirks
        output = io.BytesIO()
        img.save(output, format="JPEG")
        output.seek(0)
        img = Image.open(output)

        # Perform OCR
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")
