document.addEventListener('DOMContentLoaded', function () {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('default-btn');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const form = document.getElementById('foodimgform');

    const captureBtn = document.getElementById('capture-btn');
    const cameraContainer = document.getElementById('camera-container');
    const cameraStream = document.getElementById('camera-stream');
    const snapBtn = document.getElementById('snap-btn');
    const canvas = document.getElementById('canvas');
    let stream;

    // Drag and Drop
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('border-primary'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('border-primary'), false);
        });

        uploadArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
            handleFiles(files);
        }, false);
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            handleFiles(this.files);
        });
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImage.src = e.target.result;
                    if(uploadArea) uploadArea.style.display = 'none';
                    if(cameraContainer) cameraContainer.classList.add('d-none');
                    if(previewContainer) previewContainer.classList.remove('d-none');
                }
                reader.readAsDataURL(file);
            } else {
                alert('Please upload an image file (JPG, PNG)');
            }
        }
    }

    // Camera Capture
    if (captureBtn) {
        captureBtn.addEventListener('click', async () => {
            if(uploadArea) uploadArea.style.display = 'none';
            if(previewContainer) previewContainer.classList.add('d-none');
            if(cameraContainer) cameraContainer.classList.remove('d-none');
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                cameraStream.srcObject = stream;
            } catch (err) {
                console.error("Error accessing camera: ", err);
                alert('Could not access the camera. Please check permissions and try again.');
                if(uploadArea) uploadArea.style.display = 'block';
                if(cameraContainer) cameraContainer.classList.add('d-none');
            }
        });
    }

    if (snapBtn) {
        snapBtn.addEventListener('click', () => {
            canvas.width = cameraStream.videoWidth;
            canvas.height = cameraStream.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(cameraStream, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/jpeg');
            previewImage.src = dataUrl;

            canvas.toBlob((blob) => {
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
            }, 'image/jpeg');

            stream.getTracks().forEach(track => track.stop());
            if(cameraContainer) cameraContainer.classList.add('d-none');
            if(previewContainer) previewContainer.classList.remove('d-none');
        });
    }

    // Reset
    window.resetUpload = function () {
        if(form) form.reset();
        if(previewContainer) previewContainer.classList.add('d-none');
        if(uploadArea) uploadArea.style.display = 'block';
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if(cameraContainer) cameraContainer.classList.add('d-none');
    }

    // Form submission indicator
    if (form) {
        form.addEventListener('submit', function (e) {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Generating Recipe...';
        });
    }

    // Hover effect for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
}); 