import Tesseract from 'tesseract.js';
import { jsPDF } from 'jspdf';
import DOMPurify from 'dompurify';

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewCanvas = document.getElementById('previewCanvas');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const processBtn = document.getElementById('processBtn');
const outputText = document.getElementById('outputText');
const copyBtn = document.getElementById('copyBtn');
const downloadTxtBtn = document.getElementById('downloadTxtBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

let currentImage = null;

// Handle drag and drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

['dragleave', 'dragend'].forEach(type => {
  dropZone.addEventListener(type, () => {
    dropZone.classList.remove('drag-over');
  });
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

// Handle file selection
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

// Process image file
function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    showError('Please upload an image file (JPG, PNG, or BMP)');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showError('File size should be less than 5MB');
    return;
  }

  const reader = new FileReader();
  
  reader.onload = (e) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        // Clear previous results
        resetOutput();
        
        // Draw image on canvas
        const ctx = previewCanvas.getContext('2d');
        const maxWidth = 800;
        const maxHeight = 600;
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        
        previewCanvas.width = width;
        previewCanvas.height = height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Store image and update UI
        currentImage = previewCanvas;
        previewCanvas.classList.add('loaded');
        previewPlaceholder.classList.add('hidden');
        processBtn.disabled = false;
        
      } catch (err) {
        console.error('Error processing image:', err);
        showError('Error preparing image. Please try again.');
      }
    };

    img.onerror = () => {
      showError('Failed to load image. Please try a different file.');
    };

    img.src = e.target.result;
  };

  reader.onerror = () => {
    showError('Error reading file. Please try again.');
  };

  reader.readAsDataURL(file);
}

// Process image with Tesseract
processBtn.addEventListener('click', async () => {
  if (!currentImage) {
    showError('Please upload an image first');
    return;
  }

  try {
    startProcessing();
    outputText.value = 'Initializing...';

    const imageToProcess = currentImage; // Use the original canvas image

    // Initialize worker with progress logging
    const worker = await Tesseract.createWorker({
      logger: m => {
        console.log('Worker status:', m);
        switch (m.status) {
          case 'loading tesseract core':
            outputText.value = 'Loading OCR engine...';
            break;
          case 'initializing tesseract':
            outputText.value = 'Initializing...';
            break;
          case 'loading language traineddata':
            outputText.value = 'Loading language data...';
            break;
          case 'loaded language traineddata': // Added specific log for this status
            console.log(`Loaded language data for: ${m.lang}`);
            outputText.value = 'Language data loaded...';
            break;
          case 'initializing api':
            outputText.value = 'Preparing...';
            break;
          case 'recognizing text':
            outputText.value = `Converting image to text... ${Math.floor(m.progress * 100)}%`;
            break;
          default:
            outputText.value = 'Processing...';
        }
      }
    });

    // Load and initialize with supported languages (excluding Chinese)
    const languages = 'eng+fra+spa+deu';
    await worker.loadLanguage(languages);
    await worker.initialize(languages);

    // Recognize with simplified settings
    const { data } = await worker.recognize(imageToProcess, { 
      tessedit_ocr_engine_mode: 1 
    });

    console.log('Tesseract recognition data:', data); 

    if (!data || !data.text.trim()) {
      throw new Error('No text was detected in the image');
    }

    // Update results
    outputText.value = data.text;
    enableOutputActions();

    await worker.terminate();
  } catch (error) {
    console.error('Recognition error:', error);
    outputText.value = error.message === 'No text was detected in the image'
      ? 'No text was detected. Please try a clearer image.'
      : 'Error processing image. Please try again.';
  } finally {
    stopProcessing();
  }
});

// Copy text
copyBtn.addEventListener('click', async () => {
  if (!outputText.value) return;
  
  try {
    await navigator.clipboard.writeText(outputText.value);
    showSuccess(copyBtn, 'Copied!');
  } catch (err) {
    showError('Failed to copy text');
  }
});

// Download as TXT
downloadTxtBtn.addEventListener('click', () => {
  if (!outputText.value) return;
  
  const blob = new Blob([outputText.value], { type: 'text/plain' });
  downloadFile(blob, 'extracted-text.txt');
});

// Download as PDF
downloadPdfBtn.addEventListener('click', () => {
  if (!outputText.value) return;
  
  try {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(outputText.value, 190);
    let y = 10;
    
    lines.forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(DOMPurify.sanitize(line), 10, y);
      y += 10;
    });
    
    doc.save('extracted-text.pdf');
  } catch (error) {
    console.error('PDF generation error:', error);
    showError('Failed to generate PDF');
  }
});

// Helper Functions
function showError(message) {
  console.error('Error:', message);
  outputText.value = message;
  alert(message);
}

function showSuccess(button, message) {
  const originalText = button.innerHTML;
  button.textContent = message;
  setTimeout(() => {
    button.innerHTML = originalText;
  }, 2000);
}

function resetOutput() {
  outputText.value = '';
  disableOutputActions();
}

function startProcessing() {
  processBtn.classList.add('processing');
  processBtn.disabled = true;
  outputText.value = 'Processing...';
}

function stopProcessing() {
  processBtn.classList.remove('processing');
  processBtn.disabled = false;
}

function enableOutputActions() {
  copyBtn.disabled = false;
  downloadTxtBtn.disabled = false;
  downloadPdfBtn.disabled = false;
}

function disableOutputActions() {
  copyBtn.disabled = true;
  downloadTxtBtn.disabled = true;
  downloadPdfBtn.disabled = true;
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
