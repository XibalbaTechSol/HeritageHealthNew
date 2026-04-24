/**
 * SIGNUP & INTAKE LOGIC — Heritage Connect
 * Handles multi-step form navigation, signature capture, and data submission.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ─── WIZARD NAVIGATION ───
    const steps = document.querySelectorAll('.form-step');
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    let currentStep = 1;

    function updateWizard() {
        // Update Form Steps
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.id.replace('step', '')) === currentStep) {
                step.classList.add('active');
            }
        });

        // Update Sidebar UI
        wizardSteps.forEach(ws => {
            const stepNum = parseInt(ws.dataset.step);
            ws.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                ws.classList.add('active');
            } else if (stepNum < currentStep) {
                ws.classList.add('completed');
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Basic validation for required fields in current step
            const currentStepEl = document.getElementById(`step${currentStep}`);
            const inputs = currentStepEl.querySelectorAll('[required]');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value) {
                    input.style.borderColor = '#ef4444';
                    valid = false;
                } else {
                    input.style.borderColor = '';
                }
            });

            if (valid && currentStep < steps.length) {
                currentStep++;
                updateWizard();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateWizard();
            }
        });
    });


    // ─── SIGNATURE PAD ───
    const canvas = document.getElementById('signaturePad');
    let signaturePad = null;
    
    if (canvas) {
        signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(10, 31, 58)'
        });

        // Resize canvas for high DPI screens
        function resizeCanvas() {
            const ratio =  Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
            signaturePad.clear();
        }

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        document.getElementById('clearSignature').addEventListener('click', () => {
            signaturePad.clear();
        });
    }


    // ─── CONDITIONAL FIELDS ───
    const prevAgencyRadios = document.querySelectorAll('input[name="prevAgency"]');
    const whichAgencyGroup = document.getElementById('whichAgencyGroup');
    
    prevAgencyRadios.forEach(r => {
        r.addEventListener('change', () => {
            whichAgencyGroup.style.display = (r.value === 'yes') ? 'block' : 'none';
        });
    });


    // ─── DATA SUBMISSION (STUB FOR NOW) ───
    const intakeForm = document.getElementById('intakeForm');
    
    intakeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (signaturePad && signaturePad.isEmpty()) {
            alert("Please provide a signature to authorize the enrollment.");
            return;
        }

        const submitBtn = document.getElementById('submitIntake');
        submitBtn.textContent = "Processing Enrollment...";
        submitBtn.disabled = true;

        // Collect all form data
        const formData = new FormData(intakeForm);
        const data = Object.fromEntries(formData.entries());
        
        // Add Signature
        data.signature = signaturePad.toDataURL();

        console.log("Collected Intake Data:", data);

        /**
         * TODO: PHASE 3 & 4
         * 1. Initialize Firebase (Auth & Firestore)
         * 2. Save 'data' to Firestore
         * 3. Initialize pdf-lib
         * 4. Fill blank PDFs and stamp 'data.signature'
         * 5. Use EmailJS to send base64 PDFs to agency
         */

        // Simulate success for now
        setTimeout(() => {
            alert("Success! Your clinical profile has been created and your authorization forms have been generated. Redirecting to Heritage Connect...");
            window.location.href = 'portal.html';
        }, 2000);
    });

});
