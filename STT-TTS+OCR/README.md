# Speech & Vision Accessibility Tool

A comprehensive web application designed to help deaf and blind individuals communicate effectively through speech-to-text, text-to-speech, and OCR functionality.

## Features

### 🎤 Speech to Text
- Real-time speech recognition in multiple languages
- Continuous recording with interim results
- Copy and read aloud functionality
- Support for English, Spanish, French, German, and Urdu (Pakistan)
- RTL (Right-to-Left) text support for Urdu

### 🔊 Text to Speech
- Convert written text to spoken audio
- Multiple voice options and speech rates
- Support for multiple languages including Urdu
- Play, pause, and stop controls
- RTL layout support

### 📷 OCR Text Extraction
- Extract text from images using camera or file upload
- Multi-language OCR support including Urdu script
- Read extracted text aloud
- Copy text to clipboard
- Specialized Urdu OCR handling

### ♿ Accessibility Features
- High contrast mode
- Large text mode
- Keyboard navigation (Ctrl+1,2,3 for tabs)
- Screen reader compatibility
- Audio feedback
- RTL layout support for Urdu and other right-to-left languages

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: Web Speech API, Tesseract.js (OCR)
- **Backend**: PHP (for additional processing)
- **Storage**: LocalStorage for auto-save
- **RTL Support**: Complete right-to-left layout for Urdu

## Browser Compatibility

- **Chrome/Chromium** (recommended for best speech recognition and Urdu support)
- **Firefox** (limited Urdu voice availability)
- **Safari** (basic support)
- **Edge** (good support)

## Installation

1. Clone or download the project files
2. Ensure you have a web server running (for PHP functionality)
3. Open `index.html` in a web browser
4. For camera access, ensure HTTPS is used in production

## File Structure
├── index.html
├── css/
│ ├── style.css
│ └── accessibility.css
├── js/
│ ├── app.js
│ ├── speech-to-text.js
│ ├── text-to-speech.js
│ ├── ocr.js
│ └── utils.js
├── assets/
│ ├── icons/
│ └── sounds/
├── php/
│ ├── ocr-process.php
│ └── tts-process.php
└── README.md

## Usage

### Speech to Text
1. Select your language (Urdu for Pakistan)
2. Click "Start Recording"
3. Speak clearly into your microphone
4. Click "Stop Recording" when finished
5. Use action buttons to copy or read the text

### Text to Speech
1. Enter or paste your text
2. Select language (Urdu for RTL support)
3. Select voice and adjust speech rate
4. Click "Speak Text" to start
5. Use pause/stop controls as needed

### OCR Text Extraction
1. Choose OCR language (Urdu for Urdu script)
2. Upload an image or use camera
3. Wait for text extraction
4. Read or copy the extracted text

## Urdu Language Support

The application includes comprehensive Urdu support:
- **Speech Recognition**: Urdu (Pakistan) - ur-PK
- **Text-to-Speech**: Urdu voices with RTL layout
- **OCR**: Urdu script recognition with specialized handling
- **RTL Layout**: Complete right-to-left text direction
- **Urdu Fonts**: Support for common Urdu fonts

## API Keys (Optional)

For enhanced functionality, you can add API keys for:
- Google Cloud Speech-to-Text
- Google Cloud Text-to-Speech
- Google Cloud Vision OCR

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
