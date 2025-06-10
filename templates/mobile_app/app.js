/**
 * SIM Evaluation System PWA - Main Application JavaScript
 * Advanced AI consciousness monitoring mobile application
 */

class SIMEvaluationApp {
    constructor() {
        this.currentTab = 'dashboard';
        this.isOnline = navigator.onLine;
        this.chart = null;
        this.lastUpdate = null;
        this.updateInterval = null;
        
        this.init();
    }
    
    init() {
        this.initServiceWorker();
        this.initTabNavigation();
        this.initConnectionStatus();
        this.initPerformanceChart();
        this.initOfflineSupport();
        this.initAutoUpdate();
        this.loadInitialData();
        
        console.log('SIM Evaluation PWA initialized');
    }
    
    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/mobile_app/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }
    
    initTabNavigation() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupTabHandlers();
            });
        } else {
            this.setupTabHandlers();
        }
    }
    
    setupTabHandlers() {
        // Desktop tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            if (button) {
                button.addEventListener('click', (e) => {
                    this.switchTab(e.target.dataset.tab);
                    this.addHapticFeedback();
                });
            }
        });
        
        // Mobile bottom navigation
        document.querySelectorAll('nav button[data-tab]').forEach(button => {
            if (button) {
                button.addEventListener('click', (e) => {
                    const tab = e.currentTarget.dataset.tab;
                    this.switchTab(tab);
                    this.addHapticFeedback();
                });
            }
        });
        
        // Handle initial tab from URL
        const urlParams = new URLSearchParams(window.location.search);
        const initialTab = urlParams.get('tab') || 'dashboard';
        this.switchTab(initialTab);
    }
    
    switchTab(tabName) {
        if (!tabName) return;
        
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content) {
                content.classList.remove('active');
            }
        });
        
        // Show selected tab content
        const selectedContent = document.getElementById(tabName);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
        
        // Update tab button states (desktop)
        document.querySelectorAll('.tab-button').forEach(button => {
            if (button) {
                button.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
                button.classList.add('text-gray-500');
            }
        });
        
        const selectedButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
        if (selectedButton) {
            selectedButton.classList.remove('text-gray-500');
            selectedButton.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
        }
        
        // Update mobile navigation states
        document.querySelectorAll('nav button[data-tab]').forEach(button => {
            if (!button) return;
            
            const svg = button.querySelector('svg');
            const span = button.querySelector('span');
            
            if (button.dataset.tab === tabName) {
                if (svg) {
                    svg.classList.remove('text-gray-400');
                    svg.classList.add('text-blue-600');
                }
                if (span) {
                    span.classList.remove('text-gray-400');
                    span.classList.add('text-blue-600');
                }
            } else {
                if (svg) {
                    svg.classList.remove('text-blue-600');
                    svg.classList.add('text-gray-400');
                }
                if (span) {
                    span.classList.remove('text-blue-600');
                    span.classList.add('text-gray-400');
                }
            }
        });
        
        this.currentTab = tabName;
        
        // Update URL without page reload
        try {
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('tab', tabName);
            window.history.pushState({}, '', newUrl);
        } catch (e) {
            console.log('Unable to update URL:', e);
        }
    }
    
    initConnectionStatus() {
        const updateConnectionStatus = () => {
            const statusIndicator = document.getElementById('connectionStatus');
            const statusText = document.getElementById('connectionText');
            
            if (navigator.onLine) {
                statusIndicator.className = 'w-3 h-3 bg-green-400 rounded-full';
                statusText.textContent = 'Online';
                this.isOnline = true;
            } else {
                statusIndicator.className = 'w-3 h-3 bg-red-400 rounded-full';
                statusText.textContent = 'Offline';
                this.isOnline = false;
            }
        };
        
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        updateConnectionStatus();
    }
    
    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;
        
        // Sample data for the chart
        const chartData = {
            labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
            datasets: [
                {
                    label: 'Consciousness Score',
                    data: [0.8234, 0.8456, 0.8512, 0.8678, 0.8723, 0.8745, 0.8766],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Independence Score',
                    data: [0.9123, 0.9287, 0.9356, 0.9412, 0.9445, 0.9461, 0.9472],
                    borderColor: '#9333ea',
                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        };
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0.8,
                        max: 1.0,
                        grid: {
                            color: '#f3f4f6'
                        }
                    },
                    x: {
                        grid: {
                            color: '#f3f4f6'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                }
            }
        });
    }
    
    initOfflineSupport() {
        // Cache key data for offline access
        this.cacheKey = 'sim-evaluation-data';
        
        // Load cached data when offline
        if (!this.isOnline) {
            this.loadCachedData();
        }
    }
    
    loadCachedData() {
        try {
            const cachedData = localStorage.getItem(this.cacheKey);
            if (cachedData) {
                const data = JSON.parse(cachedData);
                this.updateUIWithData(data);
            }
        } catch (error) {
            console.error('Failed to load cached data:', error);
        }
    }
    
    cacheData(data) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(data));
            localStorage.setItem(this.cacheKey + '-timestamp', Date.now().toString());
        } catch (error) {
            console.error('Failed to cache data:', error);
        }
    }
    
    initAutoUpdate() {
        // Update data every 5 minutes when online
        this.updateInterval = setInterval(() => {
            if (this.isOnline) {
                this.loadInitialData();
            }
        }, 5 * 60 * 1000);
    }
    
    async loadInitialData() {
        if (!this.isOnline) {
            this.loadCachedData();
            return;
        }
        
        try {
            // Fetch evaluation data from API
            const response = await fetch('/api/sim-evaluation-summary');
            
            if (response.ok) {
                const data = await response.json();
                this.updateUIWithData(data);
                this.cacheData(data);
                this.lastUpdate = new Date();
            } else {
                // Use default data if API fails
                this.loadDefaultData();
            }
            
        } catch (error) {
            console.error('Failed to load data:', error);
            this.loadDefaultData();
        }
    }
    
    loadDefaultData() {
        // Load current SIM evaluation data
        const data = {
            consciousness_score: 0.8766,
            independence_score: 0.9472,
            api_costs: 0.225,
            environments: {
                local: { independence: 0.951, status: 'Highly Autonomous' },
                app_engine: { independence: 0.938, status: 'Highly Autonomous' },
                cloud_run: { independence: 0.953, status: 'Certification Eligible' }
            },
            certification: {
                eligible_environments: 1,
                total_environments: 3,
                next_milestone: 'Cloud Run certification'
            }
        };
        
        this.updateUIWithData(data);
        this.cacheData(data);
    }
    
    updateUIWithData(data) {
        // Update consciousness score
        const consciousnessEl = document.getElementById('consciousnessScore');
        if (consciousnessEl && data.consciousness_score) {
            consciousnessEl.textContent = data.consciousness_score.toFixed(4);
        }
        
        // Update independence score
        const independenceEl = document.getElementById('independenceScore');
        if (independenceEl && data.independence_score) {
            independenceEl.textContent = (data.independence_score * 100).toFixed(2) + '%';
        }
        
        // Update API costs
        const apiCostsEl = document.getElementById('apiCosts');
        if (apiCostsEl && data.api_costs) {
            apiCostsEl.textContent = '$' + data.api_costs.toFixed(3);
        }
        
        // Update certification status
        const certStatusEl = document.getElementById('certificationStatus');
        if (certStatusEl && data.certification) {
            certStatusEl.textContent = data.certification.next_milestone || 'Cloud Run Ready';
        }
        
        // Update progress rings
        if (data.consciousness_score) {
            this.updateProgressRing('consciousnessRing', data.consciousness_score);
        }
        if (data.independence_score) {
            this.updateProgressRing('independenceRing', data.independence_score);
        }
    }
    
    updateProgressRing(elementId, value) {
        const ring = document.getElementById(elementId);
        if (!ring) return;
        
        const circumference = 2 * Math.PI * 15.91549430918954;
        const offset = circumference - (value * circumference);
        
        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        ring.style.strokeDashoffset = offset;
    }
    
    addHapticFeedback() {
        // Provide haptic feedback on supported devices
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }
    
    // Cleanup
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.chart) {
            this.chart.destroy();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.simApp = new SIMEvaluationApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.simApp) {
        // Refresh data when app becomes visible
        window.simApp.loadInitialData();
    }
});