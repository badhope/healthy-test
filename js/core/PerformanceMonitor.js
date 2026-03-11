import Logger from './Logger.js';

export class PerformanceMonitor {
    static metrics = new Map();
    static observers = [];
    static isMonitoring = false;

    static start() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;

        this.observePerformance();
        this.observeMemory();
        this.observeNetwork();

        Logger.info('PerformanceMonitor started');
    }

    static stop() {
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (e) {
                // Ignore
            }
        });
        this.observers = [];
        this.isMonitoring = false;

        Logger.info('PerformanceMonitor stopped');
    }

    static observePerformance() {
        if (typeof PerformanceObserver === 'undefined') return;

        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.recordMetric(entry.name, {
                        type: entry.entryType,
                        duration: entry.duration,
                        startTime: entry.startTime
                    });
                });
            });

            observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
            this.observers.push(observer);
        } catch (e) {
            Logger.warn('PerformanceObserver not supported:', e.message);
        }
    }

    static observeMemory() {
        if (!performance.memory) return;

        setInterval(() => {
            const memory = performance.memory;
            this.recordMetric('memory', {
                usedJSHeapSize: memory.usedJSHeapSize,
                totalJSHeapSize: memory.totalJSHeapSize,
                jsHeapSizeLimit: memory.jsHeapSizeLimit,
                timestamp: Date.now()
            });
        }, 10000);
    }

    static observeNetwork() {
        if (!navigator.connection) return;

        const connection = navigator.connection;
        this.recordMetric('network', {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
        });

        connection.addEventListener('change', () => {
            this.recordMetric('network', {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            });
        });
    }

    static recordMetric(name, data) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }

        const metricHistory = this.metrics.get(name);
        metricHistory.push({
            ...data,
            timestamp: data.timestamp || Date.now()
        });

        if (metricHistory.length > 100) {
            metricHistory.shift();
        }
    }

    static getMetric(name) {
        return this.metrics.get(name) || [];
    }

    static getAllMetrics() {
        const result = {};
        this.metrics.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }

    static measureFunction(name, fn) {
        const startMark = `${name}-start`;
        const endMark = `${name}-end`;

        performance.mark(startMark);
        const result = fn();
        performance.mark(endMark);

        try {
            performance.measure(name, startMark, endMark);
        } catch (e) {
            // Ignore
        }

        return result;
    }

    static async measureAsync(name, fn) {
        const startMark = `${name}-start`;
        const endMark = `${name}-end`;

        performance.mark(startMark);
        const result = await fn();
        performance.mark(endMark);

        try {
            performance.measure(name, startMark, endMark);
        } catch (e) {
            // Ignore
        }

        return result;
    }

    static measureRenderTime(element, callback) {
        const startTime = performance.now();
        
        callback();
        
        requestAnimationFrame(() => {
            const endTime = performance.now();
            this.recordMetric('render', {
                element: element.tagName,
                duration: endTime - startTime
            });
        });
    }

    static getNavigationTiming() {
        if (!performance.timing) return null;

        const timing = performance.timing;
        return {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            tcp: timing.connectEnd - timing.connectStart,
            request: timing.responseStart - timing.requestStart,
            response: timing.responseEnd - timing.responseStart,
            domProcessing: timing.domComplete - timing.domInteractive,
            total: timing.loadEventEnd - timing.navigationStart
        };
    }

    static getFirstPaint() {
        const entries = performance.getEntriesByType('paint');
        const firstPaint = entries.find(e => e.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    static getFirstContentfulPaint() {
        const entries = performance.getEntriesByType('paint');
        const fcp = entries.find(e => e.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    }

    static getLargestContentfulPaint() {
        return new Promise((resolve) => {
            if (typeof PerformanceObserver === 'undefined') {
                resolve(null);
                return;
            }

            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lcp = entries[entries.length - 1];
                    resolve(lcp ? lcp.startTime : null);
                    observer.disconnect();
                });

                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                resolve(null);
            }
        });
    }

    static getCLS() {
        return new Promise((resolve) => {
            if (typeof PerformanceObserver === 'undefined') {
                resolve(0);
                return;
            }

            let clsValue = 0;

            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                });

                observer.observe({ entryTypes: ['layout-shift'] });

                setTimeout(() => {
                    observer.disconnect();
                    resolve(clsValue);
                }, 5000);
            } catch (e) {
                resolve(0);
            }
        });
    }

    static getFID() {
        return new Promise((resolve) => {
            if (typeof PerformanceObserver === 'undefined') {
                resolve(null);
                return;
            }

            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const fid = entries[0];
                    resolve(fid ? fid.processingStart - fid.startTime : null);
                    observer.disconnect();
                });

                observer.observe({ entryTypes: ['first-input'] });

                setTimeout(() => {
                    observer.disconnect();
                    resolve(null);
                }, 10000);
            } catch (e) {
                resolve(null);
            }
        });
    }

    static async getWebVitals() {
        const [lcp, cls, fid] = await Promise.all([
            this.getLargestContentfulPaint(),
            this.getCLS(),
            this.getFID()
        ]);

        return {
            fp: this.getFirstPaint(),
            fcp: this.getFirstContentfulPaint(),
            lcp,
            cls,
            fid,
            navigation: this.getNavigationTiming()
        };
    }

    static generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            webVitals: null,
            metrics: this.getAllMetrics(),
            memory: performance.memory ? {
                used: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
                total: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
                limit: (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + ' MB'
            } : null,
            resources: performance.getEntriesByType('resource').length,
            scripts: document.querySelectorAll('script').length,
            stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length
        };

        this.getWebVitals().then(vitals => {
            report.webVitals = vitals;
        });

        return report;
    }

    static clearMetrics() {
        this.metrics.clear();
    }
}

export default PerformanceMonitor;
