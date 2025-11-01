class AccessibilityApp {
    constructor() {
        this.currentTab = 'speech-to-text';
        this.initializeApp();
    }

    initializeApp() {
        this.initializeTabSystem();
        this.initializeAccessibilityControls();
        this.initializeEventListeners();
    }

    initializeTabSystem() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show target tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    }
                });
                
                this.currentTab = targetTab;
                
                // Announce tab change for screen readers
                AccessibilityUtils.speak(`Switched to ${button.textContent} tab`);
            });
        });
    }

    initializeAccessibilityControls() {
        document.getElementById('high-contrast').addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isActive = document.body.classList.contains('high-contrast');
            AccessibilityUtils.showNotification(
                isActive ? 'High contrast mode enabled' : 'High contrast mode disabled'
            );
        });

        document.getElementById('large-text').addEventListener('click', () => {
            document.body.classList.toggle('large-text');
            const isActive = document.body.classList.contains('large-text');
            AccessibilityUtils.showNotification(
                isActive ? 'Large text mode enabled' : 'Large text mode disabled'
            );
        });

        document.getElementById('read-page').addEventListener('click', () => {
            this.readPageContent();
        });
    }

    initializeEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl + 1,2,3 for tabs
            if (e.ctrlKey) {
                if (e.key === '1') {
                    e.preventDefault();
                    this.switchToTab('speech-to-text');
                } else if (e.key === '2') {
                    e.preventDefault();
                    this.switchToTab('text-to-speech');
                } else if (e.key === '3') {
                    e.preventDefault();
                    this.switchToTab('ocr');
                }
            }

            // Escape key to stop speech
            if (e.key === 'Escape') {
                AccessibilityUtils.stopSpeaking();
            }
        });

        // Auto-save functionality
        setInterval(() => {
            this.autoSave();
        }, 30000); // Save every 30 seconds
    }

    switchToTab(tabName) {
        const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabButton) {
            tabButton.click();
        }
    }

    readPageContent() {
        const currentTab = document.querySelector('.tab-content.active');
        const heading = currentTab.querySelector('h2').textContent;
        const description = currentTab.querySelector('p').textContent;
        
        AccessibilityUtils.speak(`${heading}. ${description}`);
    }

    autoSave() {
        // Save current text areas to localStorage
        const speechText = document.getElementById('speech-result').value;
        const ttsText = document.getElementById('tts-text').value;
        const ocrText = document.getElementById('ocr-text-result').value;

        const saveData = {
            speechText,
            ttsText,
            ocrText,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('accessibilityToolData', JSON.stringify(saveData));
    }

    loadSavedData() {
        const savedData = localStorage.getItem('accessibilityToolData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                document.getElementById('speech-result').value = data.speechText || '';
                document.getElementById('tts-text').value = data.ttsText || '';
                document.getElementById('ocr-text-result').value = data.ocrText || '';
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new AccessibilityApp();
    app.loadSavedData();
    
    // Show welcome message
    setTimeout(() => {
        AccessibilityUtils.speak('Welcome to Speech and Vision Accessibility Tool. Use control 1, 2, 3 to navigate between tabs.');
    }, 1000);
});

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}