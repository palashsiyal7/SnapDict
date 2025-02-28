# SnapDict Core

SnapDict Core is the backend service for the SnapDict application. This guide will help you set up and run the backend on your local machine.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/palashsiyal7/snapdict-core.git
   cd snapdict-core
   ```

2. **Create a virtual environment:**

   It's a good practice to use a virtual environment to manage dependencies. You can create one using the following command:

   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**

   - On Windows:

     ```bash
     .\venv\Scripts\activate
     ```

   - On macOS and Linux:

     ```bash
     source venv/bin/activate
     ```

4. **Install the required packages:**

   Use the `requirements.txt` file to install the necessary dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. **Download NLTK data:**

   The application requires several NLTK datasets to function properly. You can download them automatically by running the setup script:

   ```bash
   python setup_nltk.py
   ```

   If you encounter issues with the automatic download, you can manually download the required NLTK data using the Python interpreter:

   ```python
   import nltk
   nltk.download('punkt')
   nltk.download('wordnet')
   nltk.download('stopwords')
   nltk.download('averaged_perceptron_tagger')
   nltk.download('omw-1.4')
   ```

## Running the Backend

1. **Navigate to the application directory:**

   Make sure you are in the `snapdict-core` directory.

2. **Run the application:**

   You can start the backend server using the following command:

   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   The server should start, and you can access it at `http://localhost:8000` or the specified port.

3. **API Documentation:**

   Once the server is running, you can access the auto-generated API documentation at:
   
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

## Troubleshooting

### NLTK Resource Errors

If you see errors related to missing NLTK resources, ensure you've run the setup script:

```bash
python setup_nltk.py
```

If issues persist, you may need to manually specify the NLTK data path:

```bash
export NLTK_DATA=/path/to/nltk_data
```

Or in Python:

```python
import nltk
nltk.data.path.append('/path/to/nltk_data')
```

## Contributing

If you wish to contribute to the project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.