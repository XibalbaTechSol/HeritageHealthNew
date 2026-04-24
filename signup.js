/**
 * SIGNUP & INTAKE LOGIC — Heritage Connect
 * Handles multi-step form navigation, signature capture, 
 * automated PDF generation, Firebase Auth/Firestore, and EmailJS delivery.
 * Using Firebase Modular SDK (v10.12.0).
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {

    // ─── WIZARD STATE ───
    const steps = document.querySelectorAll('.form-step');
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    window.currentIntakeStep = 1;

    window.updateWizardUI = function() {
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.id.replace('step', '')) === window.currentIntakeStep) {
                step.classList.add('active');
                if (window.currentIntakeStep === 5 && typeof window.resizeSignatureCanvas === 'function') {
                    setTimeout(() => window.resizeSignatureCanvas(), 250);
                }
            }
        });

        wizardSteps.forEach(ws => {
            const stepNum = parseInt(ws.dataset.step);
            ws.classList.remove('active', 'completed');
            if (stepNum === window.currentIntakeStep) ws.classList.add('active');
            else if (stepNum < window.currentIntakeStep) ws.classList.add('completed');
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ─── AUTH STATE ───
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const emailInput = document.querySelector('input[name="email"]');
            if (emailInput) emailInput.value = user.email;

            try {
                const clientDoc = await getDoc(doc(db, "clients", user.uid));
                if (!clientDoc.exists()) {
                    await setDoc(doc(db, "clients", user.uid), {
                        uid: user.uid,
                        email: user.email,
                        status: "In-Progress",
                        createdAt: serverTimestamp()
                    }, { merge: true });
                }
            } catch (e) { console.error("Profile init error:", e); }

            if (window.currentIntakeStep === 1) {
                window.currentIntakeStep = 2;
                window.updateWizardUI();
            }
        }
    });

    // ─── QUICK FILL (DEV FEATURE) ───
    document.getElementById('quickFillBtn')?.addEventListener('click', () => {
        const rand = Math.floor(Math.random() * 9000) + 1000;
        const fill = (name, val) => {
            const el = document.querySelector(`[name="${name}"]`);
            if (el) {
                if (el.type === 'radio') {
                    const r = document.querySelector(`[name="${name}"][value="${val}"]`);
                    if (r) r.checked = true;
                } else {
                    el.value = val;
                }
            }
        };

        fill('email', `test_user_${rand}@wihhs.com`);
        fill('password', 'Heritage123!');
        fill('confirmPassword', 'Heritage123!');
        fill('firstName', 'Jane');
        fill('lastName', 'Doe');
        fill('ssn', `000-00-${rand}`);
        fill('dob', '1955-04-12');
        fill('language', 'English');
        fill('gender', 'Female');
        fill('address', '14200 Washington Ave');
        fill('city', 'Sturtevant');
        fill('zip', '53177');
        fill('medicaidNumber', `WI-${rand}-X`);
        fill('doctorName', 'Dr. Robert Smith');
        fill('doctorLocation', 'Ascension All Saints');
        fill('pcwName', 'Sarah Miller');
        fill('pcwPhone', '(262) 554-0000');
        fill('referralSource', 'Heritage Health Website');
        
        alert("Wizard form auto-populated with clinical test data.");
    });

    // ─── GOOGLE SIGN IN ───
    const googleBtn = document.querySelector('.btn-social.google');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => signInWithRedirect(auth, provider));
    }
    getRedirectResult(auth).catch(e => console.error("Redirect Error:", e));

    // ─── NAVIGATION ───
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.currentIntakeStep < steps.length) {
                window.currentIntakeStep++;
                window.updateWizardUI();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.currentIntakeStep > 1) {
                window.currentIntakeStep--;
                window.updateWizardUI();
            }
        });
    });

    // ─── SIGNATURE PAD ───
    const canvas = document.getElementById('signaturePad');
    let signaturePad = null;
    if (canvas) {
        signaturePad = new window.SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(10, 31, 58)'
        });
        window.resizeSignatureCanvas = function() {
            const ratio =  Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
            signaturePad.clear();
        }
        window.addEventListener("resize", window.resizeSignatureCanvas);
        window.resizeSignatureCanvas();
        document.getElementById('clearSignature').addEventListener('click', () => signaturePad.clear());
    }

    // ─── PDF GENERATION ───
    async function generateSignedPDFs(data) {
        const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
        const attachments = [];

        async function processPDF(fileName, drawLogic) {
            const bytes = await fetch(`./${fileName}`).then(res => {
                if (!res.ok) throw new Error(`Could not load ${fileName}`);
                return res.arrayBuffer();
            });
            const pdfDoc = await PDFDocument.load(bytes);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            let sigImage = null;
            if (data.signature) sigImage = await pdfDoc.embedPng(data.signature);
            drawLogic(firstPage, font, sigImage, rgb);
            const base64 = await pdfDoc.saveAsBase64({ dataUri: false });
            attachments.push({ name: fileName.replace('.pdf', '_Signed.pdf'), data: base64 });
        }

        await processPDF('New-Client-Referral2017.pdf', (page, font, sig, rgb) => {
            const { height } = page.getSize();
            const draw = (t, x, y) => t && page.drawText(String(t), { x, y: height - y, size: 10, font });
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

        await processPDF('Medical-Release2017.pdf', (page, font, sig, rgb) => {
            const { height } = page.getSize();
            const draw = (t, x, y) => t && page.drawText(String(t), { x, y: height - y, size: 11, font });
            draw(data.doctorName, 300, 420);
            draw(new Date().toLocaleDateString(), 420, 695);
            draw(`${data.firstName} ${data.lastName}`, 300, 755);
            draw(data.dob, 200, 868);
            draw(data.pcwPhone, 600, 868);
            if (sig) page.drawImage(sig, { x: 300, y: height - 820, width: 150, height: 40 });
        });

        await processPDF('Medical-Rec-Release-Wheaton.pdf', (page, font, sig, rgb) => {
            const { height } = page.getSize();
            const draw = (t, x, y) => t && page.drawText(String(t), { x, y: height - y, size: 10, font });
            draw(data.lastName, 100, 82);
            draw(data.firstName, 550, 82);
            draw(data.address + ", " + data.city, 100, 115);
            draw(data.dob, 100, 142);
            draw(data.gender, 250, 142);
            draw(data.pcwPhone, 550, 142);
            draw(new Date().toLocaleDateString(), 820, 755);
            if (sig) page.drawImage(sig, { x: 250, y: height - 765, width: 150, height: 40 });
        });

        return attachments;
    }

    // ─── SUBMISSION ───
    const intakeForm = document.getElementById('intakeForm');
    if (intakeForm) {
        intakeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (signaturePad && signaturePad.isEmpty()) return alert("Please provide a signature.");

            const submitBtn = document.getElementById('submitIntake');
            submitBtn.textContent = "Processing...";
            submitBtn.disabled = true;

            try {
                const formData = new FormData(intakeForm);
                const data = Object.fromEntries(formData.entries());
                data.signature = signaturePad.toDataURL();

                let uid;
                if (auth.currentUser) uid = auth.currentUser.uid;
                else if (data.email && data.password) {
                    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
                    uid = cred.user.uid;
                } else throw new Error("Auth missing.");

                const signedFiles = await generateSignedPDFs(data);

                const cleanData = { ...data, uid, updatedAt: serverTimestamp(), status: "Pending Review" };
                delete cleanData.password;
                delete cleanData.confirmPassword;
                
                await setDoc(doc(db, "clients", uid), cleanData, { merge: true });

                alert("Success! Your enrollment is complete.");
                window.location.href = '/portal';

            } catch (err) {
                console.error("Submission Error:", err);
                alert("Error: " + err.message);
                submitBtn.textContent = "Complete Enrollment";
                submitBtn.disabled = false;
            }
        });
    }
});
