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

## Running the Backend

1. **Navigate to the application directory:**

   Make sure you are in the `snapdict-core` directory.

2. **Run the application:**

   You can start the backend server using the following command:

   ```bash
   python app/main.py
   ```

   The server should start, and you can access it at `http://localhost:8000` or the specified port.

## Contributing

If you wish to contribute to the project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.