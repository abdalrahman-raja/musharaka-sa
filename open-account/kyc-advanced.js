/**
 * Advanced KYC Module
 * Provides enhanced identity verification with live capture from both sides
 * Similar to professional trading platforms like Binance, Kraken, etc.
 */

class AdvancedKYC {
  constructor(options = {}) {
    this.options = {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      cameraFacingMode: 'environment', // 'user' for selfie, 'environment' for back camera
      imageQuality: 0.9,
      ...options
    };

    this.state = {
      frontImage: null,
      backImage: null,
      frontImageFile: null,
      backImageFile: null,
      cameraStream: null,
      currentCaptureSide: null
    };

    this.validators = {
      fileSize: (file) => file.size <= this.options.maxFileSize,
      fileFormat: (file) => this.options.allowedFormats.includes(file.type),
      imageQuality: (canvas) => canvas.width >= 640 && canvas.height >= 480
    };

    this.callbacks = {
      onFrontCapture: null,
      onBackCapture: null,
      onError: null,
      onSuccess: null
    };
  }

  /**
   * Initialize KYC module with DOM elements
   */
  init(config) {
    this.elements = {
      frontPreview: document.getElementById(config.frontPreviewId),
      backPreview: document.getElementById(config.backPreviewId),
      frontImage: document.getElementById(config.frontImageId),
      backImage: document.getElementById(config.backImageId),
      frontPlaceholder: document.getElementById(config.frontPlaceholderId),
      backPlaceholder: document.getElementById(config.backPlaceholderId),
      frontInput: document.getElementById(config.frontInputId),
      backInput: document.getElementById(config.backInputId),
      captureFrontBtn: document.getElementById(config.captureFrontBtnId),
      captureBackBtn: document.getElementById(config.captureBackBtnId),
      cameraModal: document.getElementById(config.cameraModalId),
      cameraVideo: document.getElementById(config.cameraVideoId),
      cameraTitle: document.getElementById(config.cameraTitleId),
      captureBtn: document.getElementById(config.captureBtnId),
      closeCameraBtn: document.getElementById(config.closeCameraBtnId)
    };

    this.setupEventListeners();
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Camera capture buttons
    this.elements.captureFrontBtn?.addEventListener('click', () => this.openCamera('front'));
    this.elements.captureBackBtn?.addEventListener('click', () => this.openCamera('back'));

    // File upload inputs
    this.elements.frontInput?.addEventListener('change', (e) => this.handleFileUpload(e, 'front'));
    this.elements.backInput?.addEventListener('change', (e) => this.handleFileUpload(e, 'back'));

    // Camera controls
    this.elements.captureBtn?.addEventListener('click', () => this.capturePhoto());
    this.elements.closeCameraBtn?.addEventListener('click', () => this.closeCamera());

    // Drag and drop
    this.setupDragAndDrop();
  }

  /**
   * Setup drag and drop functionality
   */
  setupDragAndDrop() {
    const setupZone = (previewElement, side) => {
      if (!previewElement) return;

      previewElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        previewElement.classList.add('drag-over');
      });

      previewElement.addEventListener('dragleave', () => {
        previewElement.classList.remove('drag-over');
      });

      previewElement.addEventListener('drop', (e) => {
        e.preventDefault();
        previewElement.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.handleFileUpload({ target: { files } }, side);
        }
      });
    };

    setupZone(this.elements.frontPreview, 'front');
    setupZone(this.elements.backPreview, 'back');
  }

  /**
   * Open camera for capturing ID
   */
  async openCamera(side) {
    try {
      this.state.currentCaptureSide = side;
      
      // Update modal title
      const title = side === 'front' ? 'التقاط الوجه الأمامي' : 'التقاط الوجه الخلفي';
      if (this.elements.cameraTitle) {
        this.elements.cameraTitle.textContent = title;
      }

      // Request camera access
      this.state.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.options.cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      // Set video stream
      if (this.elements.cameraVideo) {
        this.elements.cameraVideo.srcObject = this.state.cameraStream;
        this.elements.cameraVideo.play();
      }

      // Show modal
      if (this.elements.cameraModal) {
        this.elements.cameraModal.classList.add('show');
      }

    } catch (error) {
      this.handleError(`فشل الوصول إلى الكاميرا: ${error.message}`);
    }
  }

  /**
   * Close camera
   */
  closeCamera() {
    if (this.state.cameraStream) {
      this.state.cameraStream.getTracks().forEach(track => track.stop());
      this.state.cameraStream = null;
    }

    if (this.elements.cameraModal) {
      this.elements.cameraModal.classList.remove('show');
    }

    this.state.currentCaptureSide = null;
  }

  /**
   * Capture photo from camera
   */
  capturePhoto() {
    try {
      if (!this.elements.cameraVideo) return;

      const canvas = document.createElement('canvas');
      canvas.width = this.elements.cameraVideo.videoWidth || 1280;
      canvas.height = this.elements.cameraVideo.videoHeight || 720;

      // Check image quality
      if (!this.validators.imageQuality(canvas)) {
        this.handleError('جودة الصورة منخفضة جداً. حاول مرة أخرى.');
        return;
      }

      const ctx = canvas.getContext('2d');
      ctx.drawImage(this.elements.cameraVideo, 0, 0);

      // Convert to blob
      canvas.toBlob((blob) => {
        this.handleCapturedImage(blob);
      }, 'image/jpeg', this.options.imageQuality);

    } catch (error) {
      this.handleError(`فشل التقاط الصورة: ${error.message}`);
    }
  }

  /**
   * Handle captured image from camera
   */
  handleCapturedImage(blob) {
    try {
      const side = this.state.currentCaptureSide;
      
      // Create File object
      const file = new File(
        [blob],
        `id-${side}.jpg`,
        { type: 'image/jpeg' }
      );

      // Validate file
      if (!this.validators.fileSize(file)) {
        this.handleError('حجم الملف كبير جداً');
        return;
      }

      if (!this.validators.fileFormat(file)) {
        this.handleError('صيغة الملف غير مدعومة');
        return;
      }

      // Store file
      if (side === 'front') {
        this.state.frontImageFile = file;
      } else {
        this.state.backImageFile = file;
      }

      // Display preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.displayPreview(e.target.result, side);
        this.triggerCallback(`on${side.charAt(0).toUpperCase() + side.slice(1)}Capture`, file);
      };
      reader.readAsDataURL(blob);

      // Close camera
      this.closeCamera();

    } catch (error) {
      this.handleError(`خطأ في معالجة الصورة: ${error.message}`);
    }
  }

  /**
   * Handle file upload
   */
  handleFileUpload(event, side) {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];

      // Validate file
      if (!this.validators.fileSize(file)) {
        this.handleError('حجم الملف كبير جداً (الحد الأقصى 10MB)');
        return;
      }

      if (!this.validators.fileFormat(file)) {
        this.handleError('صيغة الملف غير مدعومة. استخدم JPG, PNG, أو PDF');
        return;
      }

      // Store file
      if (side === 'front') {
        this.state.frontImageFile = file;
      } else {
        this.state.backImageFile = file;
      }

      // Display preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.displayPreview(e.target.result, side);
          this.triggerCallback(`on${side.charAt(0).toUpperCase() + side.slice(1)}Capture`, file);
        };
        reader.readAsDataURL(file);
      } else {
        // PDF file
        this.displayPDFPreview(side);
        this.triggerCallback(`on${side.charAt(0).toUpperCase() + side.slice(1)}Capture`, file);
      }

    } catch (error) {
      this.handleError(`خطأ في رفع الملف: ${error.message}`);
    }
  }

  /**
   * Display image preview
   */
  displayPreview(dataUrl, side) {
    const imageElement = side === 'front' ? this.elements.frontImage : this.elements.backImage;
    const placeholderElement = side === 'front' ? this.elements.frontPlaceholder : this.elements.backPlaceholder;

    if (imageElement) {
      imageElement.src = dataUrl;
      imageElement.style.display = 'block';
    }

    if (placeholderElement) {
      placeholderElement.style.display = 'none';
    }
  }

  /**
   * Display PDF preview
   */
  displayPDFPreview(side) {
    const placeholderElement = side === 'front' ? this.elements.frontPlaceholder : this.elements.backPlaceholder;
    const imageElement = side === 'front' ? this.elements.frontImage : this.elements.backImage;

    if (imageElement) {
      imageElement.style.display = 'none';
    }

    if (placeholderElement) {
      placeholderElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
          <path d="M4.5 7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/>
        </svg>
        <span>ملف PDF تم رفعه بنجاح</span>
      `;
      placeholderElement.style.display = 'flex';
    }
  }

  /**
   * Get captured files
   */
  getFiles() {
    return {
      front: this.state.frontImageFile,
      back: this.state.backImageFile
    };
  }

  /**
   * Check if both sides are captured
   */
  isComplete() {
    return this.state.frontImageFile !== null;
  }

  /**
   * Check if back side is captured
   */
  hasBackImage() {
    return this.state.backImageFile !== null;
  }

  /**
   * Reset KYC state
   */
  reset() {
    this.state = {
      frontImage: null,
      backImage: null,
      frontImageFile: null,
      backImageFile: null,
      cameraStream: null,
      currentCaptureSide: null
    };

    // Clear previews
    if (this.elements.frontImage) this.elements.frontImage.src = '';
    if (this.elements.backImage) this.elements.backImage.src = '';
    if (this.elements.frontPlaceholder) this.elements.frontPlaceholder.style.display = 'flex';
    if (this.elements.backPlaceholder) this.elements.backPlaceholder.style.display = 'flex';
  }

  /**
   * Register callback
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event}`)) {
      this.callbacks[`on${event}`] = callback;
    }
  }

  /**
   * Trigger callback
   */
  triggerCallback(callbackName, ...args) {
    if (typeof this.callbacks[callbackName] === 'function') {
      this.callbacks[callbackName](...args);
    }
  }

  /**
   * Handle error
   */
  handleError(message) {
    console.error('KYC Error:', message);
    this.triggerCallback('onError', message);
  }

  /**
   * Get validation status
   */
  getValidationStatus() {
    return {
      frontImageValid: this.state.frontImageFile !== null,
      backImageValid: this.state.backImageFile !== null,
      isComplete: this.isComplete(),
      files: this.getFiles()
    };
  }

  /**
   * Export data for submission
   */
  exportData() {
    const formData = new FormData();
    
    if (this.state.frontImageFile) {
      formData.append('idFront', this.state.frontImageFile);
    }
    
    if (this.state.backImageFile) {
      formData.append('idBack', this.state.backImageFile);
    }

    return formData;
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedKYC;
}
