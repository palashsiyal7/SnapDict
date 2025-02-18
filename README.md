# SnapDict

SnapDict is a mobile dictionary application that allows users to look up words using their camera or by uploading image. It consists of a mobile frontend and a backend service for processing and retrieving word definitions.

## Project Structure

- **snapdict-ui**: The mobile application built with React Native and Expo.
- **snapdict-core**: The backend service built with Python, responsible for text extraction and word processing.

## Features

- Scan text using the camera
- Upload images for text extraction
- Instant word definitions and meanings
- Example usage sentences
- Cross-platform support (iOS and Android)
- Native mobile interface

## Getting Started

### Prerequisites

#### For Mobile App (snapdict-ui)

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development)
- Android Studio and Android SDK (for Android development)
- Physical device or emulator

#### For Backend (snapdict-core)

- Python 3.8 or higher
- pip (Python package installer)

### Installation

#### Mobile App (snapdict-ui)

1. Clone the repository:
   ```bash
   git clone https://github.com/palashsiyal7/snapdict.git
   cd snapdict-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   expo start
   ```

   You can then:
   - Scan the QR code with your phone (using the Expo Go app)
   - Press 'i' to open the iOS simulator
   - Press 'a' to open the Android emulator

#### Backend (snapdict-core)

1. Clone the repository:
   ```bash
   git clone https://github.com/palashsiyal7/snapdict-core.git
   cd snapdict-core
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   ```

   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```

   - On macOS and Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   python app/main.py
   ```

   The server will start, and you can access it at `http://localhost:8000`.

## Usage

1. Open the SnapDict app on your device.
2. Choose between using the camera or uploading an image.
3. Point the camera at text or select an image to extract text.
4. View the word's definition and related information.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details. 