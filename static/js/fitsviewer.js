// Pure JavaScript FITS Parser and Interactive Viewer
// Designed for Tokyo Night / Matrix Terminal styling on DO3EET.de

class FitsViewer {
    constructor(element) {
        this.wrapper = element;
        this.canvasContainer = element.querySelector('.fits-canvas-container');
        this.canvas = element.querySelector('#fits-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.fitsUrl = this.wrapper.getAttribute('data-fits-url');
        this.watermark = this.wrapper.getAttribute('data-watermark') || '';
        
        // Image Data & Dimensions
        this.header = {};
        this.headerCards = [];
        this.planes = []; // Float32Arrays of pixel values (R, G, B)
        this.width = 0;
        this.height = 0;
        this.channels = 0;
        
        // Rendering State
        this.stretchMode = 'auto'; // 'linear', 'log', 'auto'
        this.brightness = 1.0;
        this.contrast = 0.0;
        this.gamma = 1.0;
        this.activeChannel = 'rgb'; // 'rgb', 'r', 'g', 'b'
        
        // Zoom & Pan state
        this.zoom = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        
        // Offscreen canvas for fast rendering during pan/zoom
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadFits();
    }
    
    setupEventListeners() {
        // Sliders
        const brightnessSlider = this.wrapper.querySelector('#slider-brightness');
        const contrastSlider = this.wrapper.querySelector('#slider-contrast');
        const gammaSlider = this.wrapper.querySelector('#slider-gamma');
        
        const brightnessVal = this.wrapper.querySelector('#val-brightness');
        const contrastVal = this.wrapper.querySelector('#val-contrast');
        const gammaVal = this.wrapper.querySelector('#val-gamma');
        
        brightnessSlider.addEventListener('input', (e) => {
            this.brightness = parseFloat(e.target.value);
            brightnessVal.textContent = this.brightness.toFixed(1);
            this.updateImage();
        });
        
        contrastSlider.addEventListener('input', (e) => {
            this.contrast = parseFloat(e.target.value);
            contrastVal.textContent = this.contrast.toFixed(1);
            this.updateImage();
        });
        
        gammaSlider.addEventListener('input', (e) => {
            this.gamma = parseFloat(e.target.value);
            gammaVal.textContent = this.gamma.toFixed(2);
            this.updateImage();
        });
        
        // Stretch Buttons
        const btnAuto = this.wrapper.querySelector('#btn-stretch-auto');
        const btnLinear = this.wrapper.querySelector('#btn-stretch-linear');
        const btnLog = this.wrapper.querySelector('#btn-stretch-log');
        
        const setStretchMode = (mode) => {
            this.stretchMode = mode;
            [btnAuto, btnLinear, btnLog].forEach(btn => btn.classList.remove('active'));
            if (mode === 'auto') btnAuto.classList.add('active');
            if (mode === 'linear') btnLinear.classList.add('active');
            if (mode === 'log') btnLog.classList.add('active');
            this.updateImage();
        };
        
        btnAuto.addEventListener('click', () => setStretchMode('auto'));
        btnLinear.addEventListener('click', () => setStretchMode('linear'));
        btnLog.addEventListener('click', () => setStretchMode('log'));
        
        // Channel Pills
        const channelPills = this.wrapper.querySelectorAll('.fits-channel-pill');
        channelPills.forEach(pill => {
            pill.addEventListener('click', () => {
                channelPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.activeChannel = pill.getAttribute('data-channel');
                this.updateImage();
            });
        });
        
        // Zoom and Reset controls
        const btnZoomIn = this.wrapper.querySelector('#btn-zoom-in');
        const btnZoomOut = this.wrapper.querySelector('#btn-zoom-out');
        const btnZoomReset = this.wrapper.querySelector('#btn-zoom-reset');
        const btnFullscreen = this.wrapper.querySelector('#btn-fullscreen');
        
        btnZoomIn.addEventListener('click', () => this.adjustZoom(1.2));
        btnZoomOut.addEventListener('click', () => this.adjustZoom(0.8));
        btnZoomReset.addEventListener('click', () => this.resetZoom());
        
        btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
        
        // Canvas Drag and Pan
        this.canvasContainer.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click
                this.isDragging = true;
                this.startX = e.clientX - this.panX;
                this.startY = e.clientY - this.panY;
                e.preventDefault();
            }
        });
        
        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.panX = e.clientX - this.startX;
                this.panY = e.clientY - this.startY;
                this.draw();
            }
        });
        
        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        // Mouse Wheel Zoom
        this.canvasContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
            
            // Zoom centered on mouse pointer
            const rect = this.canvasContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const prevZoom = this.zoom;
            this.zoom = Math.max(0.1, Math.min(20, this.zoom * zoomFactor));
            
            // Adjust pan to center zoom on mouse
            this.panX = mouseX - (mouseX - this.panX) * (this.zoom / prevZoom);
            this.panY = mouseY - (mouseY - this.panY) * (this.zoom / prevZoom);
            
            this.draw();
        }, { passive: false });
        
        // Metadata Search
        const searchInput = this.wrapper.querySelector('#fits-search');
        searchInput.addEventListener('input', (e) => {
            this.filterMetadata(e.target.value);
        });
    }
    
    loadFits() {
        const loadingOverlay = this.wrapper.querySelector('.fits-loading-overlay');
        const loadingText = this.wrapper.querySelector('.fits-loading-text');
        
        loadingText.textContent = "Loading FITS file...";
        
        fetch(this.fitsUrl)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.arrayBuffer();
            })
            .then(buffer => {
                loadingText.textContent = "Parsing headers...";
                this.parseFits(buffer);
                loadingOverlay.style.display = 'none';
            })
            .catch(error => {
                console.error("FITS Loading Error:", error);
                loadingText.innerHTML = `<span style="color: #ff5555;">Error: ${error.message}</span>`;
            });
    }
    
    parseFits(buffer) {
        const view = new DataView(buffer);
        let offset = 0;
        let headerEnded = false;
        
        // 1. Read Header blocks (2880 bytes each)
        while (!headerEnded && offset < buffer.byteLength) {
            const blockBytes = new Uint8Array(buffer, offset, 2880);
            
            for (let cardIdx = 0; cardIdx < 36; cardIdx++) {
                const cardOffset = cardIdx * 80;
                const cardString = this.bytesToString(blockBytes.subarray(cardOffset, cardOffset + 80));
                
                if (cardString.startsWith('END     ')) {
                    headerEnded = true;
                    break;
                }
                
                this.parseHeaderCard(cardString);
            }
            
            offset += 2880;
        }
        
        if (!headerEnded) {
            throw new Error("Invalid FITS file: END card not found in header.");
        }
        
        // Read dimensions
        this.width = this.header['NAXIS1'] || 0;
        this.height = this.header['NAXIS2'] || 0;
        this.channels = this.header['NAXIS3'] || 1;
        const bitpix = this.header['BITPIX'];
        const bzero = this.header['BZERO'] !== undefined ? this.header['BZERO'] : 0;
        const bscale = this.header['BSCALE'] !== undefined ? this.header['BSCALE'] : 1;
        
        if (this.width === 0 || this.height === 0) {
            throw new Error(`Invalid dimensions in FITS header: ${this.width}x${this.height}`);
        }
        
        // 2. Read Image Data
        const numPixels = this.width * this.height;
        const bytesPerPixel = Math.abs(bitpix) / 8;
        
        if (bitpix !== 16) {
            throw new Error(`Unsupported BITPIX format: ${bitpix}. Only 16-bit FITS files are supported currently.`);
        }
        
        const expectedBytes = numPixels * this.channels * bytesPerPixel;
        if (offset + expectedBytes > buffer.byteLength) {
            throw new Error(`FITS file is truncated. Expected data size: ${expectedBytes} bytes, available: ${buffer.byteLength - offset} bytes.`);
        }
        
        const uint8 = new Uint8Array(buffer, offset, expectedBytes);
        
        // Decode big-endian 16-bit signed shorts plane-by-plane
        this.planes = [];
        for (let c = 0; c < this.channels; c++) {
            const planeOffset = c * numPixels * 2;
            const planeData = new Float32Array(numPixels);
            
            for (let i = 0; i < numPixels; i++) {
                const idx = planeOffset + i * 2;
                // Big-endian 16-bit signed
                let val = (uint8[idx] << 8) | uint8[idx + 1];
                if (val & 0x8000) {
                    val = val - 0x10000;
                }
                // Apply BZERO and BSCALE
                planeData[i] = bzero + bscale * val;
            }
            this.planes.push(planeData);
        }
        
        // If monochrome, copy plane 0 to R, G, B
        if (this.channels === 1) {
            this.planes.push(this.planes[0]);
            this.planes.push(this.planes[0]);
        }
        
        // Populate UI elements
        this.populateAstroCard();
        this.populateMetadataTable();
        
        // Initialize offscreen canvas dimensions
        this.offscreenCanvas.width = this.width;
        this.offscreenCanvas.height = this.height;
        
        // Initial Zoom fit
        this.resetZoom();
        
        // Perform initial stretch and render
        this.updateImage();
    }
    
    parseHeaderCard(cardString) {
        if (cardString.trim() === '') return;
        
        const key = cardString.substring(0, 8).trim();
        const valuePart = cardString.substring(9).trim();
        
        if (!key || key === 'COMMENT' || key === 'HISTORY') {
            this.headerCards.push({ key: key || 'INFO', val: cardString.substring(8).trim(), comment: '' });
            return;
        }
        
        let valueStr = valuePart;
        let comment = '';
        
        // Extract comment starting with / (make sure not to split inside quotes)
        let inQuotes = false;
        let slashIdx = -1;
        for (let i = 0; i < valuePart.length; i++) {
            if (valuePart[i] === "'") inQuotes = !inQuotes;
            if (valuePart[i] === '/' && !inQuotes) {
                slashIdx = i;
                break;
            }
        }
        
        if (slashIdx !== -1) {
            valueStr = valuePart.substring(0, slashIdx).trim();
            comment = valuePart.substring(slashIdx + 1).trim();
        }
        
        let parsedVal = valueStr;
        // Parse Value type
        if (valueStr.startsWith("'") && valueStr.endsWith("'")) {
            parsedVal = valueStr.substring(1, valueStr.length - 1).trim();
        } else if (valueStr === 'T') {
            parsedVal = true;
        } else if (valueStr === 'F') {
            parsedVal = false;
        } else if (valueStr !== '') {
            const num = Number(valueStr);
            if (!isNaN(num)) {
                parsedVal = num;
            }
        }
        
        this.header[key] = parsedVal;
        this.headerCards.push({ key, val: parsedVal, comment });
    }
    
    bytesToString(uint8Array) {
        let result = '';
        for (let i = 0; i < uint8Array.length; i++) {
            result += String.fromCharCode(uint8Array[i]);
        }
        return result;
    }
    
    // Stretch and draw pixel data to offscreen canvas
    updateImage() {
        if (this.planes.length === 0) return;
        
        const numPixels = this.width * this.height;
        const imgData = this.offscreenCtx.createImageData(this.width, this.height);
        
        // Calculate image statistics for Auto-Stretch
        // We find the median of the green channel (plane 1) or average channels as baseline
        const stats = this.calcStats();
        
        // Midtone parameter for MTF
        let mR = 0.5, mG = 0.5, mB = 0.5;
        let blackPoint = stats.min;
        let whitePoint = stats.max;
        
        if (this.stretchMode === 'auto') {
            // Target median value in stretched image
            const targetMedian = 0.22;
            
            // Calculate midtone parameters for R, G, B channels separately to balance color
            const getMidtone = (chMedian, chMin, chMax) => {
                const range = chMax - chMin;
                if (range <= 0) return 0.5;
                const normalizedMedian = (chMedian - chMin) / range;
                if (normalizedMedian <= 0 || normalizedMedian >= 1) return 0.05;
                
                // MTF solve: m = (x * (1 - t)) / (x * (1 - 2*t) + t)
                const m = (normalizedMedian * (1.0 - targetMedian)) / (normalizedMedian * (1.0 - 2.0 * targetMedian) + targetMedian);
                return Math.max(0.0001, Math.min(0.9999, m));
            };
            
            mR = getMidtone(stats.medianR, stats.minR, stats.maxR);
            mG = getMidtone(stats.medianG, stats.minG, stats.maxG);
            mB = getMidtone(stats.medianB, stats.minB, stats.maxB);
            
            // Clip background slightly
            blackPoint = stats.min + (stats.median - stats.min) * 0.1 * (1.0 - this.contrast);
            whitePoint = stats.max - (stats.max - stats.median) * 0.1 * this.contrast;
        } else if (this.stretchMode === 'log') {
            // Logarithmic stretch midtone
            mR = mG = mB = 0.05 * (1.0 / this.gamma);
        } else {
            // Linear stretch midtone
            mR = mG = mB = 0.5 * (1.0 / this.gamma);
        }
        
        // Apply brightness and contrast sliders adjustments
        const rRange = stats.maxR - blackPoint;
        const gRange = stats.maxG - blackPoint;
        const bRange = stats.maxB - blackPoint;
        
        // Midtone Transfer Function
        const mtf = (x, m) => {
            if (x <= 0) return 0;
            if (x >= 1) return 1;
            return ((m - 1) * x) / ((2 * m - 1) * x - m);
        };
        
        const pixels = imgData.data;
        const rPlane = this.planes[0];
        const gPlane = this.planes[1];
        const bPlane = this.planes[2];
        
        for (let i = 0; i < numPixels; i++) {
            let r = rPlane[i];
            let g = gPlane[i];
            let b = bPlane[i];
            
            // Normalize values based on black/white points
            let nR = rRange > 0 ? (r - blackPoint) / rRange : 0;
            let nG = gRange > 0 ? (g - blackPoint) / gRange : 0;
            let nB = bRange > 0 ? (b - blackPoint) / bRange : 0;
            
            // Apply stretch (MTF)
            let sR = mtf(nR, mR);
            let sG = mtf(nG, mG);
            let sB = mtf(nB, mB);
            
            // Apply brightness scale
            sR *= this.brightness;
            sG *= this.brightness;
            sB *= this.brightness;
            
            // Convert to 0-255 bytes
            let R = Math.max(0, Math.min(255, Math.round(sR * 255)));
            let G = Math.max(0, Math.min(255, Math.round(sG * 255)));
            let B = Math.max(0, Math.min(255, Math.round(sB * 255)));
            
            // Channel Filter Toggle
            const pIdx = i * 4;
            if (this.activeChannel === 'rgb') {
                pixels[pIdx] = R;
                pixels[pIdx + 1] = G;
                pixels[pIdx + 2] = B;
            } else if (this.activeChannel === 'r') {
                pixels[pIdx] = R;
                pixels[pIdx + 1] = 0;
                pixels[pIdx + 2] = 0;
            } else if (this.activeChannel === 'g') {
                pixels[pIdx] = 0;
                pixels[pIdx + 1] = G;
                pixels[pIdx + 2] = 0;
            } else if (this.activeChannel === 'b') {
                pixels[pIdx] = 0;
                pixels[pIdx + 1] = 0;
                pixels[pIdx + 2] = B;
            }
            pixels[pIdx + 3] = 255; // Alpha channel
        }
        
        this.offscreenCtx.putImageData(imgData, 0, 0);
        this.draw();
    }
    
    // Quick statistics (min, max, median estimates)
    calcStats() {
        const numPixels = this.width * this.height;
        const rPlane = this.planes[0];
        const gPlane = this.planes[1];
        const bPlane = this.planes[2];
        
        // To make median calculations fast, we sample a subset of pixels (every 16th pixel)
        const step = 16;
        const samplesR = [];
        const samplesG = [];
        const samplesB = [];
        
        let min = 65535, max = 0;
        
        for (let i = 0; i < numPixels; i += step) {
            const r = rPlane[i];
            const g = gPlane[i];
            const b = bPlane[i];
            
            samplesR.push(r);
            samplesG.push(g);
            samplesB.push(b);
            
            const val = (r + g + b) / 3.0;
            if (val < min) min = val;
            if (val > max) max = val;
        }
        
        samplesR.sort((a, b) => a - b);
        samplesG.sort((a, b) => a - b);
        samplesB.sort((a, b) => a - b);
        
        const midIdx = Math.floor(samplesR.length / 2);
        
        return {
            min,
            max,
            median: (samplesR[midIdx] + samplesG[midIdx] + samplesB[midIdx]) / 3.0,
            minR: samplesR[0],
            maxR: samplesR[samplesR.length - 1],
            medianR: samplesR[midIdx],
            minG: samplesG[0],
            maxG: samplesG[samplesG.length - 1],
            medianG: samplesG[midIdx],
            minB: samplesB[0],
            maxB: samplesB[samplesB.length - 1],
            medianB: samplesB[midIdx]
        };
    }
    
    // Draw the image and overlays onto the visible canvas
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw image with zoom and pan
        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoom, this.zoom);
        
        // Ensure smoothing is disabled to get retro-pixel look when zooming closely
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        
        this.ctx.drawImage(this.offscreenCanvas, 0, 0, this.width, this.height);
        this.ctx.restore();
        
        // Draw Watermark Overlay directly on screen canvas in bottom right
        if (this.watermark) {
            this.ctx.save();
            this.ctx.font = '0.75rem "OpenDyslexicMono", Courier, monospace';
            
            // Text measurements
            const textWidth = this.ctx.measureText(this.watermark).width;
            const x = this.canvas.width - textWidth - 12;
            const y = this.canvas.height - 12;
            
            // Background box for contrast
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            this.ctx.fillRect(x - 6, y - 14, textWidth + 12, 20);
            
            // Text color matching the theme with green shadow glow
            this.ctx.fillStyle = '#00ff41';
            this.ctx.shadowColor = '#00ff41';
            this.ctx.shadowBlur = 4;
            this.ctx.fillText(this.watermark, x, y);
            this.ctx.restore();
        }
    }
    
    // Fit the image in the canvas area
    resetZoom() {
        const containerRect = this.canvasContainer.getBoundingClientRect();
        this.canvas.width = containerRect.width || 400;
        this.canvas.height = containerRect.height || 600;
        
        // Cover scaling (fill the container)
        const scaleX = this.canvas.width / this.width;
        const scaleY = this.canvas.height / this.height;
        this.zoom = Math.max(scaleX, scaleY);
        
        // Center image
        const imgDisplayWidth = this.width * this.zoom;
        const imgDisplayHeight = this.height * this.zoom;
        
        this.panX = (this.canvas.width - imgDisplayWidth) / 2;
        this.panY = (this.canvas.height - imgDisplayHeight) / 2;
        
        this.draw();
    }
    
    adjustZoom(factor) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        const prevZoom = this.zoom;
        this.zoom = Math.max(0.1, Math.min(20, this.zoom * factor));
        
        this.panX = centerX - (centerX - this.panX) * (this.zoom / prevZoom);
        this.panY = centerY - (centerY - this.panY) * (this.zoom / prevZoom);
        
        this.draw();
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.wrapper.requestFullscreen()
                .then(() => {
                    this.wrapper.classList.add('fullscreen');
                    setTimeout(() => this.resetZoom(), 150); // Allow browser rendering reflow
                })
                .catch(err => {
                    console.error(`Error enabling fullscreen: ${err.message}`);
                });
        } else {
            document.exitFullscreen();
        }
        
        // Handle exiting fullscreen via Esc key
        const exitHandler = () => {
            if (!document.fullscreenElement) {
                this.wrapper.classList.remove('fullscreen');
                setTimeout(() => this.resetZoom(), 150);
                document.removeEventListener('fullscreenchange', exitHandler);
            }
        };
        document.addEventListener('fullscreenchange', exitHandler);
    }
    
    // Parse decimal RA and DEC into nice hours/minutes/seconds sexagesimal format
    formatCoordinates(ra, dec) {
        if (ra === undefined || dec === undefined) return { raStr: 'N/A', decStr: 'N/A' };
        
        // RA Hours, Minutes, Seconds (15 degrees = 1 hour)
        const raH = ra / 15.0;
        const h = Math.floor(raH);
        const mVal = (raH - h) * 60.0;
        const m = Math.floor(mVal);
        const s = ((mVal - m) * 60.0).toFixed(2);
        
        const raStr = `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.padStart(5, '0')}s`;
        
        // DEC Sign, Degrees, Minutes, Seconds
        const decAbs = Math.abs(dec);
        const sign = dec >= 0 ? '+' : '-';
        const d = Math.floor(decAbs);
        const dmVal = (decAbs - d) * 60.0;
        const dm = Math.floor(dmVal);
        const ds = ((dmVal - dm) * 60.0).toFixed(1);
        
        const decStr = `${sign}${d.toString().padStart(2, '0')}° ${dm.toString().padStart(2, '0')}′ ${ds.padStart(4, '0')}″`;
        
        return { raStr, decStr };
    }
    
    populateAstroCard() {
        const objName = this.header['OBJECT'] || 'Unknown Target';
        const telescope = this.header['TELESCOP'] || this.header['INSTRUME'] || 'ZWO Seestar';
        const exposure = this.header['EXPOSURE'] || this.header['EXPTIME'] || 0;
        const stackCount = this.header['STACKCNT'] || 1;
        const filter = this.header['FILTER'] || 'None';
        const gain = this.header['GAIN'] || 0;
        const temp = this.header['CCD-TEMP'] !== undefined ? this.header['CCD-TEMP'] : 'N/A';
        const dateObs = this.header['DATE-OBS'] || 'N/A';
        const ra = this.header['RA'];
        const dec = this.header['DEC'];
        const { raStr, decStr } = this.formatCoordinates(ra, dec);
        
        // Format Observation Date/Time
        let formattedDate = 'N/A';
        if (dateObs !== 'N/A') {
            try {
                const cleanDateStr = dateObs.split('.')[0];
                const d = new Date(cleanDateStr + 'Z'); // FITS DATE-OBS is in UTC
                if (!isNaN(d.getTime())) {
                    const day = d.getUTCDate().toString().padStart(2, '0');
                    const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
                    const year = d.getUTCFullYear();
                    const hours = d.getUTCHours().toString().padStart(2, '0');
                    const minutes = d.getUTCMinutes().toString().padStart(2, '0');
                    const seconds = d.getUTCSeconds().toString().padStart(2, '0');
                    formattedDate = `${day}.${month}.${year}, ${hours}:${minutes}:${seconds} UTC`;
                } else {
                    formattedDate = dateObs;
                }
            } catch (e) {
                formattedDate = dateObs;
            }
        }
        
        // Update Astro Card Fields
        this.setValue('astro-object', objName);
        this.setValue('astro-telescope', telescope);
        this.setValue('astro-exposure', `${exposure}s (Total: ${Math.round(exposure * stackCount)}s)`);
        this.setValue('astro-stack', `${stackCount} frames`);
        this.setValue('astro-filter', filter);
        this.setValue('astro-gain', gain);
        this.setValue('astro-temp', temp !== 'N/A' ? `${temp}°C` : 'N/A');
        this.setValue('astro-date', formattedDate);
        this.setValue('astro-coords', `${raStr} / ${decStr}`);
        
        // Setup Sky Map links if RA and DEC coordinates are present
        const actionsGroup = this.wrapper.querySelector('.fits-astro-actions');
        actionsGroup.innerHTML = ''; // Clear default
        
        if (ra !== undefined && dec !== undefined) {
            const siteLat = this.header['SITELAT'];
            const siteLong = this.header['SITELONG'];
            
            // RA in decimal hours
            const raHours = (ra / 15.0).toFixed(6);
            
            // Stellarium Web Link
            // Stellarium accepts search by object name in the URL path, and observer parameters (lat, lng, elev, date, fov) via query params
            let stellariumUrl = 'https://stellarium-web.org';
            const params = [];
            
            // 1. Observer Location
            if (siteLat !== undefined && siteLong !== undefined) {
                params.push(`lat=${siteLat}`);
                params.push(`lng=${siteLong}`);
                params.push('elev=0');
            }
            
            // 2. Date and Time (DATE-OBS) formatted as ISO UTC string
            if (dateObs && dateObs !== 'N/A') {
                const dateIso = dateObs.split('.')[0].trim() + (dateObs.endsWith('Z') ? '' : 'Z');
                params.push(`date=${dateIso}`);
            }
            
            // 3. Field of View (FOV) calculation
            let fovVal = '60.00';
            const cleanObjName = objName.replace(/['"]/g, '').trim();
            const isValidName = cleanObjName && 
                                cleanObjName.toLowerCase() !== 'unknown target' && 
                                cleanObjName.toLowerCase() !== 'unknown' &&
                                cleanObjName.toLowerCase() !== 'light';
                                
            if (this.header['FOCALLEN'] && this.header['XPIXSZ'] && this.header['NAXIS1'] && this.header['NAXIS2']) {
                const pxSz = this.header['XPIXSZ'];
                const focal = this.header['FOCALLEN'];
                const w = this.header['IMAGEW'] || this.header['NAXIS1'];
                const h = this.header['IMAGEH'] || this.header['NAXIS2'];
                const diagPx = Math.sqrt(w * w + h * h);
                const diagMm = diagPx * pxSz / 1000.0;
                const calcFov = 2 * Math.atan(diagMm / (2 * focal)) * 180.0 / Math.PI;
                // For known objects, zoom to telescope view + padding (1.5x)
                // For unknown targets, keep a slightly wider view (60 degrees) to give sky context
                fovVal = (isValidName ? calcFov * 1.5 : 60.0).toFixed(2);
            } else if (isValidName) {
                fovVal = '2.00'; // Default narrow zoom for deep sky targets
            }
            params.push(`fov=${fovVal}`);
            
            const queryString = params.length > 0 ? `?${params.join('&')}` : '';
            
            if (isValidName) {
                stellariumUrl = `https://stellarium-web.org/skysource/${encodeURIComponent(cleanObjName)}${queryString}`;
            } else {
                stellariumUrl = `https://stellarium-web.org/${queryString}`;
            }
            
            const stellariumBtn = this.createActionButton('Stellarium Web', stellariumUrl, 'Objekt oder Himmelsausschnitt in Stellarium Web anzeigen');
            actionsGroup.appendChild(stellariumBtn);
        }
    }
    
    setValue(id, value) {
        const el = this.wrapper.querySelector(`#${id}`);
        if (el) el.textContent = value;
    }
    
    createActionButton(text, url, title) {
        const btn = document.createElement('a');
        btn.className = 'fits-action-btn';
        btn.href = url;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.title = title;
        btn.textContent = text;
        return btn;
    }
    
    populateMetadataTable() {
        const tableBody = this.wrapper.querySelector('#fits-metadata-rows');
        tableBody.innerHTML = ''; // Clear loading placeholder
        
        this.headerCards.forEach(card => {
            const tr = document.createElement('tr');
            
            const tdKey = document.createElement('td');
            tdKey.className = 'fits-metadata-key';
            tdKey.textContent = card.key;
            
            const tdVal = document.createElement('td');
            tdVal.className = 'fits-metadata-val';
            tdVal.textContent = String(card.val);
            
            const tdComment = document.createElement('td');
            tdComment.className = 'fits-metadata-comment';
            tdComment.textContent = card.comment ? `// ${card.comment}` : '';
            
            tr.appendChild(tdKey);
            tr.appendChild(tdVal);
            tr.appendChild(tdComment);
            
            tableBody.appendChild(tr);
        });
    }
    
    filterMetadata(query) {
        const rows = this.wrapper.querySelectorAll('#fits-metadata-rows tr');
        const lowerQuery = query.toLowerCase().trim();
        
        rows.forEach(row => {
            const keyText = row.querySelector('.fits-metadata-key').textContent.toLowerCase();
            const valText = row.querySelector('.fits-metadata-val').textContent.toLowerCase();
            const commentText = row.querySelector('.fits-metadata-comment').textContent.toLowerCase();
            
            if (keyText.includes(lowerQuery) || valText.includes(lowerQuery) || commentText.includes(lowerQuery)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}

// Initialize all viewers on the page once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const viewers = document.querySelectorAll('.fits-viewer-wrapper');
    viewers.forEach(el => {
        new FitsViewer(el);
    });
});
