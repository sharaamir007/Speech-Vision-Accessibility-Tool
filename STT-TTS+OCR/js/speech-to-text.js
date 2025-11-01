class SpeechToText {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.finalTranscript = '';
        this.interimTranscript = '';
        
        this.initializeRecognition();
        this.bindEvents();
    }

    initializeRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error('Speech recognition not supported in this browser');
            AccessibilityUtils.showNotification('Speech recognition is not supported in your browser', 'error');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = document.getElementById('stt-language').value;

        this.recognition.onstart = () => {
            this.isRecording = true;
            this.updateUI(true);
            AccessibilityUtils.speak('Recording started');
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            this.updateUI(false);
        };

        this.recognition.onresult = (event) => {
            this.interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    this.finalTranscript += transcript + ' ';
                } else {
                    this.interimTranscript += transcript;
                }
            }
            
            this.updateTextArea();
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            AccessibilityUtils.showNotification(`Speech recognition error: ${event.error}`, 'error');
            this.stopRecording();
        };
    }

    bindEvents() {
        document.getElementById('start-recording').addEventListener('click', () => {
            this.startRecording();
        });

        document.getElementById('stop-recording').addEventListener('click', () => {
            this.stopRecording();
        });

        document.getElementById('stt-language').addEventListener('change', (e) => {
            if (this.recognition) {
                this.recognition.lang = e.target.value;
            }
        });

        document.getElementById('copy-speech').addEventListener('click', () => {
            const text = document.getElementById('speech-result').value;
            if (text.trim()) {
                AccessibilityUtils.copyToClipboard(text);
            }
        });

        document.getElementById('speak-result').addEventListener('click', () => {
            const text = document.getElementById('speech-result').value;
            if (text.trim()) {
                AccessibilityUtils.speak(text);
            }
        });

        document.getElementById('clear-speech').addEventListener('click', () => {
            this.clearText();
        });
    }

    startRecording() {
        if (!this.recognition) {
            this.initializeRecognition();
        }

        if (this.recognition && !this.isRecording) {
            this.finalTranscript = '';
            this.interimTranscript = '';
            this.updateTextArea();
            
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
            }
        }
    }

    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
            AccessibilityUtils.speak('Recording stopped');
        }
    }

    updateUI(recording) {
        const startBtn = document.getElementById('start-recording');
        const stopBtn = document.getElementById('stop-recording');
        const status = document.getElementById('recording-status');

        if (recording) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            status.textContent = 'Recording... Speak now';
            status.className = 'status recording';
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            status.textContent = 'Ready to record';
            status.className = 'status';
        }
    }

    updateTextArea() {
        const textarea = document.getElementById('speech-result');
        textarea.value = this.finalTranscript + this.interimTranscript;
        textarea.scrollTop = textarea.scrollHeight;
    }

    clearText() {
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.updateTextArea();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpeechToText();
});