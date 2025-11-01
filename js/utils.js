// Utility functions
class AccessibilityUtils {
    static speak(text, rate = 1) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            speechSynthesis.speak(utterance);
            return utterance;
        }
        return null;
    }

    static stopSpeaking() {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    }

    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Text copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
            color: white;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Language mapping for different services
const LANGUAGE_MAP = {
    'en-US': { tts: 'en-US', ocr: 'eng' },
    'es-ES': { tts: 'es-ES', ocr: 'spa' },
    'fr-FR': { tts: 'fr-FR', ocr: 'fra' },
    'de-DE': { tts: 'de-DE', ocr: 'deu' },
    'hi-IN': { tts: 'hi-IN', ocr: 'hin' }
};