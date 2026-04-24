/**
 * SIGNUP & INTAKE LOGIC — Heritage Connect
 * Handles multi-step form navigation, signature capture, 
 * automated PDF generation, Firebase Auth/Firestore, and EmailJS delivery.
 * Using Firebase Modular SDK (v9+).
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Global libraries loaded via CDN in HTML
const PDFLib = window.PDFLib;
const SignaturePad = window.SignaturePad;
const emailjs = window.emailjs;

// ─── CONFIGURATION ───
const firebaseConfig = {
  apiKey: "AIzaSyA3CvTjZ03mg0yjqK8WW-doRb7vcCP-cHQ",
  authDomain: "hhs-new.firebaseapp.com",
  projectId: "hhs-new",
  storageBucket: "hhs-new.firebasestorage.app",
  messagingSenderId: "996139618301",
  appId: "1:996139618301:web:6b2326edda6968f809d394",
  measurementId: "G-Q8NZ603J99"
};

// TODO: Replace with your credentials from EmailJS Dashboard
const emailjsConfig = {
    publicKey: "YOUR_PUBLIC_KEY",
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {

    // ─── GOOGLE SIGN IN ───
    const googleBtn = document.querySelector('.btn-social.google');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                console.log("Google User:", user.email);
                
                // Pre-fill email if possible
                const emailInput = document.querySelector('input[name="email"]');
                if (emailInput) emailInput.value = user.email;

                // Advance to Demographics Step automatically
                currentStep = 2;
                updateWizard();
                
            } catch (error) {
                console.error("Google Auth Error:", error);
                alert("Google Sign-In failed: " + error.message);
            }
        });
    }
    
    // ─── WIZARD NAVIGATION ───
    const steps = document.querySelectorAll('.form-step');
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    let currentStep = 1;

    function updateWizard() {
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.id.replace('step', '')) === currentStep) {
                step.classList.add('active');
            }
        });

        wizardSteps.forEach(ws => {
            const stepNum = parseInt(ws.dataset.step);
            ws.classList.remove('active', 'completed');
            if (stepNum === currentStep) ws.classList.add('active');
            else if (stepNum < currentStep) ws.classList.add('completed');
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
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
    if (prevAgencyRadios && whichAgencyGroup) {
        prevAgencyRadios.forEach(r => {
            r.addEventListener('change', () => {
                whichAgencyGroup.style.display = (r.value === 'yes') ? 'block' : 'none';
            });
        });
    }


    // ─── PDF PROCESSING (pdf-lib) ───
    async function generateSignedPDFs(data) {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const attachments = [];

        async function processPDF(fileName, drawLogic) {
            const url = `./${fileName}`;
            const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            
            let sigImage = null;
            if (data.signature) {
                sigImage = await pdfDoc.embedPng(data.signature);
            }

            drawLogic(firstPage, font, sigImage, rgb);
            
            // Output as base64 string for EmailJS
            const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: false });
            attachments.push({
                name: fileName.replace('.pdf', '_Signed.pdf'),
                data: pdfBase64
            });
        }

        // 1. Referral Form Mapping
        await processPDF('New-Client-Referral2017.pdf', (page, font, sig, rgb) => {
            const { height } = page.getSize();
            const draw = (text, x, y, size = 10) => {
                if (text) page.drawText(String(text), { x, y: height - y, size, font });
            };
            draw(new Date().toLocaleDateString(), 550, 195);
            draw(`${data.lastName}, ${data.firstName}`, 100, 255);
            draw(data.ssn, 70, 272);
            draw(data.pcwPhone, 450, 272);
            draw(data.dob, 70, 305);
            draw(data.language, 420, 305);
            draw(data.gender, 760, 305);
            draw(data.address, 130, 345);
            draw(data.city, 400, 345);
            draw(data.zip, 720, 345);
            draw(data.medicaidNumber, 150, 395);
            draw(data.doctorName, 170, 415);
            draw(data.doctorLocation, 600, 415);
            draw(data.pcwName, 200, 855);
        });

        // 2. Medical Release Mapping
        await processPDF('Medical-Release2017.pdf', (page, font, sig, rgb) => {
            const { height } = page.getSize();
            const draw = (text, x, y, size = 11) => {
                if (text) page.drawText(String(text), { x, y: height - y, size, font });
            };
            draw(data.doctorName, 300, 420);
            draw(new Date().toLocaleDateString(), 420, 695);
            draw(`${data.firstName} ${data.lastName}`, 300, 755);
            draw(data.dob, 200, 868);
            draw(data.pcwPhone, 600, 868);
            if (sig) page.drawImage(sig, { x: 300, y: height - 820, width: 150, height: 40 });
        });

        // 3. Wheaton Mapping
        await processPDF('Medical-Rec-Release-Wheaton.pdf', (page, font, sig, rgb) => {
            const { height } = page.getSize();
            const draw = (text, x, y, size = 10) => {
                if (text) page.drawText(String(text), { x, y: height - y, size, font });
            };
            draw(data.lastName, 100, 82);
            draw(data.firstName, 550, 82);
            draw(data.address + ", " + data.city + ", WI " + data.zip, 100, 115);
            draw(data.dob, 100, 142);
            draw(data.gender, 250, 142);
            draw(data.pcwPhone, 550, 142);
            draw(new Date().toLocaleDateString(), 820, 755);
            if (sig) page.drawImage(sig, { x: 250, y: height - 765, width: 150, height: 40 });
        });

        return attachments;
    }


    // ─── FINAL DATA SUBMISSION ───
    const intakeForm = document.getElementById('intakeForm');
    
    intakeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (signaturePad && signaturePad.isEmpty()) {
            alert("Please provide a signature to authorize the enrollment.");
            return;
        }

        const submitBtn = document.getElementById('submitIntake');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Processing & Securing Enrollment...";
        submitBtn.disabled = true;

        try {
            const formData = new FormData(intakeForm);
            const data = Object.fromEntries(formData.entries());
            data.signature = signaturePad.toDataURL();

            let uid;
            
            // 1. Handle User Creation/Retrieval
            // If the user used Google, they are already signed in.
            // If they filled out the password fields, we create them.
            if (auth.currentUser) {
                uid = auth.currentUser.uid;
            } else if (data.email && data.password) {
                const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
                uid = userCredential.user.uid;
            } else {
                throw new Error("Please complete the Account Setup (Step 1) before submitting.");
            }

            // 2. Generate Signed PDFs in Browser
            const signedFiles = await generateSignedPDFs(data);

            // 3. Save Profile Data to Firestore
            const cleanData = { ...data };
            delete cleanData.password;
            delete cleanData.confirmPassword;
            cleanData.uid = uid;
            cleanData.submittedAt = serverTimestamp();
            cleanData.status = "Pending Review";
            
            await setDoc(doc(db, "clients", uid), cleanData, { merge: true });

            // 4. Send Signed Packet via EmailJS
            emailjs.init(emailjsConfig.publicKey);
            await emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, {
                client_name: `${data.firstName} ${data.lastName}`,
                client_email: data.email,
                client_phone: data.pcwPhone,
                referral_doc: signedFiles[0].data,
                release_doc_1: signedFiles[1].data,
                release_doc_2: signedFiles[2].data
            });

            alert("Success! Your account has been created, your clinical profile saved, and signed forms sent to our team. Redirecting to Heritage Connect...");
            window.location.href = 'portal.html';

        } catch (err) {
            console.error("Enrollment Error:", err);
            alert("An error occurred: " + err.message);
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

});
