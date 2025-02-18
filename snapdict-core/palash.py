# from PIL import Image

# try:
#     with Image.open("IMG_5108.jpg") as img:
#         print("Format:", img.format)
#         print("Size:", img.size)
#         print("Mode:", img.mode)
# except Exception as e:
#     print("Error opening image:", e)

from PIL import Image

try:
    with Image.open("IMG_5108.jpg") as img:
        print("Format:", img.format)
        print("Size:", img.size)
        print("Mode:", img.mode)
except Exception as e:
    print("Error opening image:", e)
