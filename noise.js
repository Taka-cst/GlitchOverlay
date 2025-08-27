class GlitchOverlay {
    constructor(options = {}) {
        this.options = {
            intensity: options.intensity || 0.3,
            noiseAmount: options.noiseAmount || 0.1,
            glitchFrequency: options.glitchFrequency || 2000,
            scanlineSpeed: options.scanlineSpeed || 0.5,
            colorShift: options.colorShift || true,
            randomTiming: options.randomTiming || true,
            
            // 新しい色設定オプション
            colors: {
                scanline: options.colors?.scanline || '#00ff00',     // スキャンラインの色
                noise: options.colors?.noise || '#ffffff',          // ノイズの色
                glitchR: options.colors?.glitchR || '#ff0000',       // グリッチ赤チャンネル
                glitchG: options.colors?.glitchG || '#00ff00',       // グリッチ緑チャンネル
                glitchB: options.colors?.glitchB || '#0000ff',       // グリッチ青チャンネル
                aberration: options.colors?.aberration || '#ff00ff', // 色収差の色
                ...options.colors
            },
            
            // ランダムタイミング設定
            randomRange: {
                frequencyMin: options.randomRange?.frequencyMin || 1000,
                frequencyMax: options.randomRange?.frequencyMax || 4000,
                durationMin: options.randomRange?.durationMin || 100,
                durationMax: options.randomRange?.durationMax || 500,
                ...options.randomRange
            },
            
            enabled: true,
            ...options
        };
        
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.glitchTime = 0;
        this.scanlinePosition = 0;
        this.nextGlitchTime = 0;
        this.glitchDuration = 0;
        this.currentGlitchEnd = 0;
        
        this.init();
    }
    
    init() {
        if (!document.body) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: '9999',
            mixBlendMode: 'screen'
        });
        
        this.updateCanvasSize();
        document.body.appendChild(this.canvas);
        
        window.addEventListener('resize', () => this.updateCanvasSize());
        
        this.scheduleNextGlitch();
        
        this.startAnimation();
    }
    
    updateCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
    }
    
    scheduleNextGlitch() {
        if (this.options.randomTiming) {
            const { frequencyMin, frequencyMax, durationMin, durationMax } = this.options.randomRange;
            
            const randomInterval = frequencyMin + Math.random() * (frequencyMax - frequencyMin);
            this.nextGlitchTime = this.glitchTime + randomInterval;
            
            this.glitchDuration = durationMin + Math.random() * (durationMax - durationMin);
        } else {
            this.nextGlitchTime = this.glitchTime + this.options.glitchFrequency;
            this.glitchDuration = 200;
        }
    }
    
    hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    generateNoise(x, y, width, height) {
        const imageData = this.ctx.createImageData(width, height);
        const data = imageData.data;
        const noiseColor = this.hexToRgba(this.options.colors.noise, 1);
        const [r, g, b] = noiseColor.match(/\d+/g).map(Number);
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * this.options.noiseAmount;
            data[i] = r * noise;     // R
            data[i + 1] = g * noise; // G
            data[i + 2] = b * noise; // B
            data[i + 3] = Math.random() * 50; // A
        }
        
        this.ctx.putImageData(imageData, x, y);
    }
    
    drawGlitchBars() {
        const { width, height } = this.canvas;
        const barCount = 5 + Math.random() * 10;
        
        for (let i = 0; i < barCount; i++) {
            const y = Math.random() * height;
            const barHeight = 2 + Math.random() * 8;
            const offset = (Math.random() - 0.5) * 20 * this.options.intensity;
            
            this.ctx.fillStyle = this.hexToRgba(this.options.colors.glitchR, 0.1 * this.options.intensity);
            this.ctx.fillRect(offset, y, width, barHeight);
            
            this.ctx.fillStyle = this.hexToRgba(this.options.colors.glitchG, 0.1 * this.options.intensity);
            this.ctx.fillRect(offset + 2, y, width, barHeight);
            
            this.ctx.fillStyle = this.hexToRgba(this.options.colors.glitchB, 0.1 * this.options.intensity);
            this.ctx.fillRect(offset - 2, y, width, barHeight);
        }
    }
    
    drawScanlines() {
        const { width, height } = this.canvas;
        
        this.scanlinePosition += this.options.scanlineSpeed;
        if (this.scanlinePosition > height) this.scanlinePosition = 0;
        
        const scanColor = this.hexToRgba(this.options.colors.scanline, 1);
        const [r, g, b] = scanColor.match(/\d+/g).map(Number);
        
        const gradient = this.ctx.createLinearGradient(0, this.scanlinePosition, 0, this.scanlinePosition + 100);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.1)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, this.scanlinePosition, width, 2);
        
        for (let y = 0; y < height; y += 4) {
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.02)`;
            this.ctx.fillRect(0, y, width, 1);
        }
    }
    
    drawColorAberration() {
        const { width, height } = this.canvas;
        const aberrationColor = this.hexToRgba(this.options.colors.aberration, 1);
        const [r, g, b] = aberrationColor.match(/\d+/g).map(Number);
        
        for (let i = 0; i < 3; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 50 + Math.random() * 100;
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, `rgba(${r}, 0, 0, ${0.05 * this.options.intensity})`);
            gradient.addColorStop(0.3, `rgba(0, ${g}, 0, ${0.03 * this.options.intensity})`);
            gradient.addColorStop(0.6, `rgba(0, 0, ${b}, ${0.02 * this.options.intensity})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x - size, y - size, size * 2, size * 2);
        }
    }
    
    animate() {
        if (!this.options.enabled) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.glitchTime += 16;
        
        const isGlitchTime = this.glitchTime >= this.nextGlitchTime && 
                            this.glitchTime <= this.nextGlitchTime + this.glitchDuration;
        
        if (isGlitchTime) {
            this.drawGlitchBars();
            
            const noiseCount = this.options.randomTiming ? 
                              Math.floor(2 + Math.random() * 8) : 5;
            
            for (let i = 0; i < noiseCount; i++) {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                const w = 50 + Math.random() * 100;
                const h = 20 + Math.random() * 40;
                this.generateNoise(x, y, w, h);
            }
        }
        
        if (this.glitchTime > this.nextGlitchTime + this.glitchDuration && 
            this.currentGlitchEnd !== this.nextGlitchTime) {
            this.currentGlitchEnd = this.nextGlitchTime;
            this.scheduleNextGlitch();
        }
        
        this.drawScanlines();
        
        if (this.options.colorShift) {
            this.drawColorAberration();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    startAnimation() {
        this.animate();
    }
    
    stop() {
        this.options.enabled = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
    
    setIntensity(intensity) {
        this.options.intensity = Math.max(0, Math.min(1, intensity));
    }
    
    setColors(newColors) {
        this.options.colors = { ...this.options.colors, ...newColors };
    }
    
    setRandomRange(newRange) {
        this.options.randomRange = { ...this.options.randomRange, ...newRange };
    }
    
    burst(duration = 1000) {
        const originalIntensity = this.options.intensity;
        this.options.intensity = 1;
        
        setTimeout(() => {
            this.options.intensity = originalIntensity;
        }, duration);
    }
}

window.GlitchUtils = {
    start: (options = {}) => {
        if (window.glitchOverlay) {
            window.glitchOverlay.stop();
        }
        window.glitchOverlay = new GlitchOverlay(options);
        return window.glitchOverlay;
    },
    
    stop: () => {
        if (window.glitchOverlay) {
            window.glitchOverlay.stop();
            window.glitchOverlay = null;
        }
    },
    
    burst: (duration) => {
        if (window.glitchOverlay) {
            window.glitchOverlay.burst(duration);
        }
    },
    
    // 新しいユーティリティ関数
    setColors: (colors) => {
        if (window.glitchOverlay) {
            window.glitchOverlay.setColors(colors);
        }
    },
    
    setRandomRange: (range) => {
        if (window.glitchOverlay) {
            window.glitchOverlay.setRandomRange(range);
        }
    }
};

(function() {
    function autoStartGlitch() {
        try {
            window.glitchOverlay = new GlitchOverlay({
                intensity: 0.5,
                randomTiming: true,
                randomRange: {
                    frequencyMin: 500,
                    frequencyMax: 2000,
                    durationMin: 200,
                    durationMax: 800
                },
                colors: {
                    scanline: '#00ff00',
                    noise: '#ffffff',
                    glitchR: '#ff0000',
                    glitchG: '#00ff00',
                    glitchB: '#0000ff',
                    aberration: '#ff00ff'
                }
            });
            
            setTimeout(() => {
                if (window.glitchOverlay) {
                    window.glitchOverlay.burst(1000);
                }
            }, 3000);
            
        } catch (error) {
            console.error('Glitch Overlay creation error:', error);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoStartGlitch);
    } else {
        setTimeout(autoStartGlitch, 100);
    }
    
    window.addEventListener('load', function() {
        if (!window.glitchOverlay) {
            autoStartGlitch();
        }
    });
})();

setTimeout(function() {
    try {
        window.glitchOverlay = new GlitchOverlay({
            intensity: 0.4,
            randomTiming: true,
            randomRange: {
                frequencyMin: 800,
                frequencyMax: 2500,
                durationMin: 200,
                durationMax: 700
            },
            colors: {
                scanline: '#00ff00',
                noise: '#ffffff',
                glitchR: '#ff0000',
                glitchG: '#00ff00',
                glitchB: '#0000ff',
                aberration: '#ff00ff'
            }
        });
        
    } catch (error) {
        console.error('Auto glitch start error:', error);
        setTimeout(function() {
            try {
                window.glitchOverlay = new GlitchOverlay();
            } catch (retryError) {
                console.error('Retry also failed:', retryError);
            }
        }, 1000);
    }
}, 50);