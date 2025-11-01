class TextToSpeech {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        
        this.initializeVoices();
        this.bindEvents();
    }

    initializeVoices() {
        // Load available voices
        const loadVoices = () => {
            const voices = this.synthesis.getVoices();
            const voiceSelect = document.getElementById('tts-voice');
            
            // Clear existing options except the first one
            while (voiceSelect.options.length > 1) {
                voiceSelect.remove(1);
            }
            
            // Add available voices
            voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                voiceSelect.appendChild(option);
            });
        };

        // Chrome loads voices asynchronously
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = loadVoices;
        }
        
        loadVoices();
    }

    bindEvents() {
        document.getElementById('speak-text').addEventListener('click', () => {
            this.speakText();
        });

        document.getElementById('pause-tts').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('stop-tts').addEventListener('click', () => {
            this.stopSpeaking();
        });

        document.getElementById('clear-tts').addEventListener('click', () => {
            this.clearText();
        });

        document.getElementById('tts-rate').addEventListener('input', (e) => {
            document.getElementById('rate-value').textContent = e.target.value;
        });

        // Update utterance if speaking when rate changes
        document.getElementById('tts-rate').addEventListener('change', (e) => {
            if (this.isPlaying && !this.isPaused) {
                this.stopSpeaking();
                this.speakText();
            }
        });
    }

    speakText() {
        const text = document.getElementById('tts-text').value.trim();
        if (!text) {
            AccessibilityUtils.showNotification('Please enter some text to speak', 'error');
            return;
        }

        this.stopSpeaking(); // Stop any current speech

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice properties
        const voiceSelect = document.getElementById('tts-voice');
        const selectedVoice = this.synthesis.getVoices().find(voice => voice.name === voiceSelect.value);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        utterance.rate = parseFloat(document.getElementById('tts-rate').value);
        utterance.lang = document.getElementById('tts-language').value;

        utterance.onstart = () => {
            this.isPlaying = true;
            this.isPaused = false;
            this.updateTTSButtons(true, false);
        };

        utterance.onend = () => {
            this.isPlaying = false;
            this.isPaused = false;
            this.updateTTSButtons(false, false);
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            AccessibilityUtils.showNotification('Error speaking text', 'error');
            this.isPlaying = false;
            this.isPaused = false;
            this.updateTTSButtons(false, false);
        };

        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
    }

    togglePause() {
        if (this.isPlaying && !this.isPaused) {
            this.synthesis.pause();
            this.isPaused = true;
            this.updateTTSButtons(true, true);
        } else if (this.isPlaying && this.isPaused) {
            this.synthesis.resume();
            this.isPaused = false;
            this.updateTTSButtons(true, false);
        }
    }

    stopSpeaking() {
        this.synthesis.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.updateTTSButtons(false, false);
    }

    updateTTSButtons(playing, paused) {
        const speakBtn = document.getElementById('speak-text');
        const pauseBtn = document.getElementById('pause-tts');
        const stopBtn = document.getElementById('stop-tts');

        speakBtn.disabled = playing;
        pauseBtn.disabled = !playing;
        stopBtn.disabled = !playing;

        pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    }

    clearText() {
        document.getElementById('tts-text').value = '';
        this.stopSpeaking();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextToSpeech();
});