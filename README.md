# 📝 Simple Image to Text Converter

<div align="center">

[![Built with Tesseract.js](https://img.shields.io/badge/Built%20with-Tesseract.js-blue)](http://tesseract.projectnaptha.com/)
[![Language Support](https://img.shields.io/badge/Languages-4-green)](https://github.com/naptha/tesseract.js#languages)
[![MIT License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

A simple web application that extracts text from images using Optical Character Recognition (OCR).
</div>

## 🤔 How it Works

1.  **Upload:** You provide an image file (JPG, PNG, BMP) containing text.
2.  **Process:** The application uses the Tesseract.js library in your browser to analyze the image.
3.  **Extract:** Tesseract.js performs OCR to recognize and extract the text found in the image.
4.  **Display:** The extracted text is displayed in a text area, ready for you to copy or download.

## ✨ Features

- 🖼️ **Easy Upload:** Drag & drop or browse to upload your image.
- 🌍 **Language Support:** Recognizes text in:
  - English 🇺🇸
  - French 🇫🇷
  - Spanish 🇪🇸
  - German 🇩🇪
- 📋 **Export Options:**
  - Copy extracted text to clipboard.
  - Download as a plain text (.txt) file.
  - Download as a PDF document.
- 📱 **Responsive Design:** Works on desktop and mobile devices.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/deepjyotiseal/image-to-text.git
    cd image-to-text
    ```

2.  Install dependencies:
    ```sh
    npm install
    ```

3.  Start the development server:
    ```sh
    npm start
    ```
    This usually opens the app in your browser at `http://localhost:1234`.

## 💻 Usage

1.  **Upload an Image:** Drag and drop an image (JPG, PNG, BMP) onto the designated area, or click the area to browse and select a file.
2.  **Convert:** Click the "Convert to Text" button.
3.  **Get Results:** Wait for the processing to finish. The extracted text will appear in the text area.
4.  **Export:** Use the buttons to copy the text or download it as a TXT or PDF file.

## ⚙️ Technical Details

- [Tesseract.js](https://github.com/naptha/tesseract.js): The core OCR engine running in the browser.
- [Parcel](https://parceljs.org/): Web application bundler for development and building.
- [jsPDF](https://github.com/parallax/jsPDF): Used for generating PDF downloads.
- HTML, SCSS, and Vanilla JavaScript.

## 🤝 Contributing

Contributions are welcome! Please feel free to fork the repository, make changes, and open a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 🙏 Acknowledgments

- [Tesseract.js](https://github.com/naptha/tesseract.js)
- [Inter Font](https://rsms.me/inter/)
- [Feather Icons](https://feathericons.com/)