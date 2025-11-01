class OCRProcessor {
    constructor() {
        this.worker = null;
        this.isProcessing = false;
        this.initializeWorker();
        this.bindEvents();
    }

    initializeWorker() {
        // Tesseract.js worker initialization
        this.worker = Tesseract.createWorker({
            logger: progress => this.updateOCRStatus(progress)
        });
    }

    async bindEvents() {
        document.getElementById('camera-capture').addEventListener('click', () => {
            this.captureFromCamera();
        });

        document.getElementById('upload-image').addEventListener('click', () => {
            document.getElementById('image-upload').click();
        });

        document.getElementById('image-upload').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        document.getElementById('speak-ocr').addEventListener('click', () => {
            this.speakExtractedText();
        });

        document.getElementById('copy-ocr').addEventListener('click', () => {
            this.copyExtractedText();
        });

        document.getElementById('clear-ocr').addEventListener('click', () => {
            this.clearOCR();
        });

        // Initialize Tesseract worker
        try {
            await this.worker.load();
            await this.worker.loadLanguage('eng');
            await this.worker.initialize('eng');
        } catch (error) {
            console.error('Failed to initialize OCR worker:', error);
            AccessibilityUtils.showNotification('Failed to initialize OCR engine', 'error');
        }
    }

    async captureFromCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.showCameraModal(stream);
        } catch (error) {
            console.error('Camera access denied:', error);
            AccessibilityUtils.showNotification('Camera access denied. Please allow camera permissions.', 'error');
        }
    }

    showCameraModal(stream) {
        // Create camera modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.style.cssText = `
            max-width: 90%;
            max-height: 70%;
            border-radius: 10px;
        `;

        const captureBtn = document.createElement('button');
        captureBtn.textContent = 'Capture Image';
        captureBtn.className = 'btn btn-primary';
        captureBtn.style.marginTop = '20px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.style.marginTop = '10px';

        captureBtn.onclick = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            canvas.toBlob(blob => {
                this.handleImageUpload(blob);
                modal.remove();
                stream.getTracks().forEach(track => track.stop());
            });
        };

        cancelBtn.onclick = () => {
            modal.remove();
            stream.getTracks().forEach(track => track.stop());
        };

        modal.appendChild(video);
        modal.appendChild(captureBtn);
        modal.appendChild(cancelBtn);
        document.body.appendChild(modal);
    }

    handleImageUpload(file) {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            AccessibilityUtils.showNotification('Please select an image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('preview-image');
            const noImage = document.getElementById('no-image');
            
            preview.src = e.target.result;
            preview.style.display = 'block';
            noImage.style.display = 'none';
            
            this.processImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    async processImage(imageData) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.updateOCRStatus({ status: 'Recognizing text...' });

        try {
            const language = document.getElementById('ocr-language').value;
            
            // Set OCR language
            await this.worker.loadLanguage(language);
            await this.worker.initialize(language);

            const { data: { text } } = await this.worker.recognize(imageData);
            
            document.getElementById('ocr-text-result').value = text.trim();
            this.updateOCRStatus({ status: 'Text extraction completed' });
            AccessibilityUtils.showNotification('Text extracted successfully!', 'success');
            
        } catch (error) {
            console.error('OCR processing error:', error);
            AccessibilityUtils.showNotification('Error extracting text from image', 'error');
            this.updateOCRStatus({ status: 'Error processing image' });
        } finally {
            this.isProcessing = false;
        }
    }

    updateOCRStatus(progress) {
        const statusElement = document.getElementById('ocr-status');
        
        if (progress.status) {
            statusElement.textContent = progress.status;
            
            if (progress.status.includes('recognizing')) {
                statusElement.className = 'status recording';
            } else if (progress.status.includes('completed') || progress.status.includes('success')) {
                statusElement.className = 'status success';
            } else if (progress.status.includes('error')) {
                statusElement.className = 'status error';
            } else {
                statusElement.className = 'status';
            }
        }
    }

    speakExtractedText() {
        const text = document.getElementById('ocr-text-result').value.trim();
        if (text) {
            AccessibilityUtils.speak(text);
        } else {
            AccessibilityUtils.showNotification('No text to speak', 'error');
        }
    }

    copyExtractedText() {
        const text = document.getElementById('ocr-text-result').value.trim();
        if (text) {
            AccessibilityUtils.copyToClipboard(text);
        } else {
            AccessibilityUtils.showNotification('No text to copy', 'error');
        }
    }

    clearOCR() {
        document.getElementById('preview-image').src = '';
        document.getElementById('preview-image').style.display = 'none';
        document.getElementById('no-image').style.display = 'block';
        document.getElementById('ocr-text-result').value = '';
        this.updateOCRStatus({ status: 'Ready for image upload or capture' });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    new OCRProcessor();
});