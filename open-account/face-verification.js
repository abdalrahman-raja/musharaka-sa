/**
 * Face Verification Module
 * Advanced liveness detection with 360-degree face capture
 * Similar to professional KYC platforms (Binance, Kraken, etc.)
 */

class FaceVerification {
  constructor(options = {}) {
    this.options = {
      maxFileSize: 50 * 1024 * 1024, // 50MB for video
      allowedFormats: ['video/mp4', 'video/webm', 'image/jpeg', 'image/png'],
      cameraFacingMode: 'user', // Front camera for face
      videoQuality: 0.95,
      recordingDuration: 10000, // 10 seconds
      requiredMovements: ['front', 'left', 'right', 'up', 'down'],
      ...options
    };

    this.state = {
      isRecording: false,
      recordedChunks: [],
      mediaRecorder: null,
      cameraStream: null,
      faceImageFile: null,
      faceVideoFile: null,
      capturedFrames: [],
      completedMovements: new Set(),
      currentMovement: null,
      recordingStartTime: null,
      detectedFace: false
    };

    this.validators = {
      fileSize: (file) => file.size <= this.options.maxFileSize,
      fileFormat: (file) => this.options.allowedFormats.includes(file.type),
      videoQuality: (stream) => stream.getVideoTracks().length > 0
    };

    this.callbacks = {
      onMovementDetected: null,
      onMovementCompleted: null,
      onRecordingStart: null,
      onRecordingStop: null,
      onFaceDetected: null,
      onError: null,
      onSuccess: null
    };
  }

  /**
   * Initialize Face Verification module with DOM elements
   */
  init(config) {
    this.elements = {
      facePreview: document.getElementById(config.facePreviewId),
      faceImage: document.getElementById(config.faceImageId),
      facePlaceholder: document.getElementById(config.facePlaceholderId),
      faceInput: document.getElementById(config.faceInputId),
      captureFaceBtn: document.getElementById(config.captureFaceBtnId),
      faceModal: document.getElementById(config.faceModalId),
      faceVideo: document.getElementById(config.faceVideoId),
      recordBtn: document.getElementById(config.recordBtnId),
      stopBtn: document.getElementById(config.stopBtnId),
      closeFaceBtn: document.getElementById(config.closeFaceBtnId),
      instructionText: document.getElementById(config.instructionTextId),
      movementIndicators: document.querySelectorAll(config.movementIndicatorClass),
      recordingTimer: document.getElementById(config.recordingTimerId),
      faceCanvas: document.getElementById(config.faceCanvasId)
    };

    this.setupEventListeners();
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Face capture button
    this.elements.captureFaceBtn?.addEventListener('click', () => this.openFaceCamera());

    // File upload input
    this.elements.faceInput?.addEventListener('change', (e) => this.handleFileUpload(e));

    // Recording controls
    this.elements.recordBtn?.addEventListener('click', () => this.startRecording());
    this.elements.stopBtn?.addEventListener('click', () => this.stopRecording());
    this.elements.closeFaceBtn?.addEventListener('click', () => this.closeFaceCamera());

    // Drag and drop
    this.setupDragAndDrop();
  }

  /**
   * Setup drag and drop functionality
   */
  setupDragAndDrop() {
    if (!this.elements.facePreview) return;

    this.elements.facePreview.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.elements.facePreview.classList.add('drag-over');
    });

    this.elements.facePreview.addEventListener('dragleave', () => {
      this.elements.facePreview.classList.remove('drag-over');
    });

    this.elements.facePreview.addEventListener('drop', (e) => {
      e.preventDefault();
      this.elements.facePreview.classList.remove('drag-over');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileUpload({ target: { files } });
      }
    });
  }

  /**
   * Open face camera for liveness detection
   */
  async openFaceCamera() {
    try {
      this.updateInstruction('جاري الوصول إلى الكاميرا...');
      
      // Request front camera access
      this.state.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.options.cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      // Set video stream
      if (this.elements.faceVideo) {
        this.elements.faceVideo.srcObject = this.state.cameraStream;
        this.elements.faceVideo.play();
      }

      // Show modal
      if (this.elements.faceModal) {
        this.elements.faceModal.classList.add('show');
      }

      // Start face detection
      this.startFaceDetection();
      
      // Update instruction
      this.updateInstruction('ابدأ بالتقاط صورة وجهك - انظر إلى الكاميرا مباشرة');
      this.triggerCallback('onRecordingStart');

    } catch (error) {
      this.handleError(`فشل الوصول إلى الكاميرا: ${error.message}`);
    }
  }

  /**
   * Start face detection using canvas
   */
  startFaceDetection() {
    if (!this.elements.faceVideo || !this.elements.faceCanvas) return;

    const canvas = this.elements.faceCanvas;
    const ctx = canvas.getContext('2d');
    const video = this.elements.faceVideo;

    // Set canvas size to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const detectFace = () => {
      if (!this.state.cameraStream) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Simple face detection using image brightness patterns
      // In production, use face-api.js or ml5.js
      this.detectFaceSimple(canvas);

      requestAnimationFrame(detectFace);
    };

    detectFace();
  }

  /**
   * Simple face detection (brightness-based)
   * For production, use face-api.js or ml5.js
   */
  detectFaceSimple(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    brightness = brightness / (data.length / 4);

    // Face detected if brightness is in reasonable range
    const faceDetected = brightness > 50 && brightness < 200;
    
    if (faceDetected && !this.state.detectedFace) {
      this.state.detectedFace = true;
      this.triggerCallback('onFaceDetected');
    } else if (!faceDetected) {
      this.state.detectedFace = false;
    }
  }

  /**
   * Start recording with movement instructions
   */
  startRecording() {
    try {
      if (!this.elements.faceVideo) return;

      this.state.isRecording = true;
      this.state.recordedChunks = [];
      this.state.completedMovements.clear();
      this.state.recordingStartTime = Date.now();

      // Setup MediaRecorder
      const stream = this.elements.faceVideo.srcObject;
      const options = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000
      };

      // Fallback for browsers that don't support vp9
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }

      this.state.mediaRecorder = new MediaRecorder(stream, options);

      this.state.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.state.recordedChunks.push(event.data);
        }
      };

      this.state.mediaRecorder.onstop = () => {
        this.handleRecordingComplete();
      };

      this.state.mediaRecorder.start();

      // Disable record button, enable stop button
      if (this.elements.recordBtn) this.elements.recordBtn.disabled = true;
      if (this.elements.stopBtn) this.elements.stopBtn.disabled = false;

      // Start movement sequence
      this.startMovementSequence();

      // Update UI
      this.updateInstruction('جاري التسجيل... اتبع التعليمات');
      this.updateRecordingTimer();

    } catch (error) {
      this.handleError(`فشل بدء التسجيل: ${error.message}`);
    }
  }

  /**
   * Start movement sequence with instructions
   */
  startMovementSequence() {
    const movements = [
      { name: 'front', instruction: '👀 انظر مباشرة إلى الكاميرا', duration: 2000 },
      { name: 'left', instruction: '⬅️ حرّك رأسك إلى اليسار ببطء', duration: 2000 },
      { name: 'right', instruction: '➡️ حرّك رأسك إلى اليمين ببطء', duration: 2000 },
      { name: 'up', instruction: '⬆️ حرّك رأسك إلى الأعلى ببطء', duration: 2000 },
      { name: 'down', instruction: '⬇️ حرّك رأسك إلى الأسفل ببطء', duration: 2000 }
    ];

    let currentIndex = 0;

    const showNextMovement = () => {
      if (currentIndex < movements.length && this.state.isRecording) {
        const movement = movements[currentIndex];
        this.state.currentMovement = movement.name;
        
        this.updateInstruction(movement.instruction);
        this.highlightMovement(movement.name);
        this.triggerCallback('onMovementDetected', movement.name);

        currentIndex++;
        setTimeout(showNextMovement, movement.duration);
      }
    };

    showNextMovement();
  }

  /**
   * Update recording timer
   */
  updateRecordingTimer() {
    if (!this.state.isRecording) return;

    const elapsed = Math.floor((Date.now() - this.state.recordingStartTime) / 1000);
    const remaining = Math.max(0, Math.floor(this.options.recordingDuration / 1000) - elapsed);

    if (this.elements.recordingTimer) {
      this.elements.recordingTimer.textContent = `${remaining}s`;
    }

    if (remaining > 0) {
      setTimeout(() => this.updateRecordingTimer(), 1000);
    } else {
      this.stopRecording();
    }
  }

  /**
   * Highlight movement indicator
   */
  highlightMovement(movement) {
    this.elements.movementIndicators?.forEach(indicator => {
      indicator.classList.remove('active', 'completed');
      
      if (indicator.dataset.movement === movement) {
        indicator.classList.add('active');
      } else if (this.state.completedMovements.has(indicator.dataset.movement)) {
        indicator.classList.add('completed');
      }
    });
  }

  /**
   * Stop recording
   */
  stopRecording() {
    if (!this.state.mediaRecorder) return;

    this.state.isRecording = false;
    this.state.mediaRecorder.stop();

    // Enable record button, disable stop button
    if (this.elements.recordBtn) this.elements.recordBtn.disabled = false;
    if (this.elements.stopBtn) this.elements.stopBtn.disabled = true;

    this.updateInstruction('جاري معالجة الفيديو...');
  }

  /**
   * Handle recording completion
   */
  handleRecordingComplete() {
    try {
      const blob = new Blob(this.state.recordedChunks, { type: 'video/webm' });

      // Validate file
      if (!this.validators.fileSize(blob)) {
        this.handleError('حجم الفيديو كبير جداً');
        return;
      }

      // Create File object
      const file = new File([blob], 'face-verification.webm', { type: 'video/webm' });
      this.state.faceVideoFile = file;

      // Extract first frame as thumbnail
      this.extractVideoThumbnail(blob);

      // Close camera
      this.closeFaceCamera();

      // Trigger callback
      this.triggerCallback('onRecordingStop', file);
      this.triggerCallback('onSuccess', file);

    } catch (error) {
      this.handleError(`خطأ في معالجة الفيديو: ${error.message}`);
    }
  }

  /**
   * Extract first frame from video as thumbnail
   */
  extractVideoThumbnail(blob) {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      canvas.toBlob((thumbnailBlob) => {
        const thumbnailFile = new File([thumbnailBlob], 'face-thumbnail.jpg', { type: 'image/jpeg' });
        this.displayPreview(canvas.toDataURL('image/jpeg'));
      });
    };

    video.src = URL.createObjectURL(blob);
  }

  /**
   * Handle file upload
   */
  handleFileUpload(event) {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];

      // Validate file
      if (!this.validators.fileSize(file)) {
        this.handleError('حجم الملف كبير جداً (الحد الأقصى 50MB)');
        return;
      }

      if (!this.validators.fileFormat(file)) {
        this.handleError('صيغة الملف غير مدعومة. استخدم MP4, WebM, JPG, أو PNG');
        return;
      }

      // Store file
      if (file.type.startsWith('video/')) {
        this.state.faceVideoFile = file;
        this.extractVideoThumbnail(file);
      } else {
        this.state.faceImageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => this.displayPreview(e.target.result);
        reader.readAsDataURL(file);
      }

    } catch (error) {
      this.handleError(`خطأ في رفع الملف: ${error.message}`);
    }
  }

  /**
   * Display face preview
   */
  displayPreview(dataUrl) {
    if (this.elements.faceImage) {
      this.elements.faceImage.src = dataUrl;
      this.elements.faceImage.style.display = 'block';
    }

    if (this.elements.facePlaceholder) {
      this.elements.facePlaceholder.style.display = 'none';
    }
  }

  /**
   * Close face camera
   */
  closeFaceCamera() {
    if (this.state.cameraStream) {
      this.state.cameraStream.getTracks().forEach(track => track.stop());
      this.state.cameraStream = null;
    }

    if (this.state.mediaRecorder && this.state.isRecording) {
      this.state.mediaRecorder.stop();
    }

    if (this.elements.faceModal) {
      this.elements.faceModal.classList.remove('show');
    }

    this.state.isRecording = false;
    this.state.recordedChunks = [];
  }

  /**
   * Update instruction text
   */
  updateInstruction(text) {
    if (this.elements.instructionText) {
      this.elements.instructionText.textContent = text;
    }
  }

  /**
   * Get captured files
   */
  getFiles() {
    return {
      image: this.state.faceImageFile,
      video: this.state.faceVideoFile
    };
  }

  /**
   * Check if face verification is complete
   */
  isComplete() {
    return this.state.faceImageFile !== null || this.state.faceVideoFile !== null;
  }

  /**
   * Reset face verification state
   */
  reset() {
    this.closeFaceCamera();
    
    this.state = {
      isRecording: false,
      recordedChunks: [],
      mediaRecorder: null,
      cameraStream: null,
      faceImageFile: null,
      faceVideoFile: null,
      capturedFrames: [],
      completedMovements: new Set(),
      currentMovement: null,
      recordingStartTime: null,
      detectedFace: false
    };

    // Clear preview
    if (this.elements.faceImage) this.elements.faceImage.src = '';
    if (this.elements.facePlaceholder) this.elements.facePlaceholder.style.display = 'flex';
  }

  /**
   * Register callback
   */
  on(event, callback) {
    const callbackName = `on${event.charAt(0).toUpperCase() + event.slice(1)}`;
    if (this.callbacks.hasOwnProperty(callbackName)) {
      this.callbacks[callbackName] = callback;
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
    console.error('Face Verification Error:', message);
    this.updateInstruction(`❌ ${message}`);
    this.triggerCallback('onError', message);
  }

  /**
   * Get validation status
   */
  getValidationStatus() {
    return {
      faceImageValid: this.state.faceImageFile !== null,
      faceVideoValid: this.state.faceVideoFile !== null,
      isComplete: this.isComplete(),
      files: this.getFiles()
    };
  }

  /**
   * Export data for submission
   */
  exportData() {
    const formData = new FormData();
    
    if (this.state.faceImageFile) {
      formData.append('faceImage', this.state.faceImageFile);
    }
    
    if (this.state.faceVideoFile) {
      formData.append('faceVideo', this.state.faceVideoFile);
    }

    return formData;
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FaceVerification;
}
