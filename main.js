/**
 * MAIN INTERACTION LOGIC — Heritage Health Services
 * Handles UI elements, scroll effects, and Firebase Auth for Sign-In.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', () => {

    // ─── UTILS ───
    function safeAddListener(id, event, callback) {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, callback);
    }

    // ─── Environment Detection ───
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:';

    // ─── Mobile Menu Toggle ───
    const mobileToggle = document.getElementById('mobileToggle');
    const navList = document.querySelector('.nav-list');
    if (mobileToggle && navList) {
        mobileToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // ─── Header Scroll Logic ───
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }, { passive: true });
    }

    // ─── Reveal on Scroll ───
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ─── Smooth Scroll ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navList && navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });

    // ─── Portal Sign-In (Real Firebase Auth) ───
    const portalForm = document.getElementById('portalForm');
    if (portalForm) {
        portalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = portalForm.querySelector('input[type="email"]').value;
            const password = portalForm.querySelector('input[type="password"]').value;
            const btn = portalForm.querySelector('button[type="submit"]');

            const originalBtnText = btn.textContent;
            btn.textContent = 'Verifying Account...';
            btn.disabled = true;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = 'portal.html';
            } catch (err) {
                console.error("Auth Error:", err);
                alert("Sign-In Failed: " + err.message);
                btn.textContent = originalBtnText;
                btn.disabled = false;
            }
        });
    }

    // ─── Chatbot ───
    const chatBubble = document.getElementById('chatBubble');
    const chatWindow = document.getElementById('chatWindow');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    const SYSTEM_PROMPT = "You are the Heritage Health Services clinical support AI. Be professional, compassionate, and informative. You are a Registered Nurse. Refer to (262) 554-8800 for assessments.";

    if (chatBubble && chatWindow) {
        chatBubble.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active') && chatInput) {
                setTimeout(() => chatInput.focus(), 100);
            }
        });
    }

    safeAddListener('closeChat', 'click', () => {
        if (chatWindow) chatWindow.classList.remove('active');
    });

    function appendMessage(sender, text) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function callGemini(msg) {
        let key = sessionStorage.getItem('HHS_CHAT_KEY');
        if (!key) {
            key = prompt("Real AI Engine Detected (Local Only). Please enter your Gemini API Key:");
            if (key) sessionStorage.setItem('HHS_CHAT_KEY', key);
            else return null;
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${msg}` }] }] })
            });
            const data = await resp.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            console.error("AI Error:", e);
            return null;
        }
    }

    function getClinicalResponse(msg) {
        const lower = msg.toLowerCase();
        if (lower.includes('caregiver') || lower.includes('paid') || lower.includes('pay')) {
            return "As an RN, I can confirm that Wisconsin Medicaid offers a path for family members to be compensated for providing essential care. To begin, we establish 'Medical Necessity' through a physician’s order and a professional nursing assessment. Would you like to schedule a free RN consultation?";
        }
        if (lower.includes('assessment') || lower.includes('start') || lower.includes('enroll')) {
            return "Our enrollment process starts with a free in-home nursing assessment. We evaluate Activities of Daily Living (ADLs) to create a personalized Plan of Care. You can call our clinical team at (262) 554-8800 to set this up.";
        }
        if (lower.includes('hmo') || lower.includes('title 19') || lower.includes('insurance')) {
            return "We work with both Straight Title 19 and most major Medicaid HMOs like iCare. Our intake team acts as your administrative advocate to navigate these specific insurance requirements.";
        }
        return "Thank you for reaching out. As clinical needs are unique, I recommend speaking with one of our Heritage Health care coordinators at (262) 554-8800 for specific guidance tailored to your loved one’s condition.";
    }

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (!msg) return;

            appendMessage('user', msg);
            chatInput.value = '';

            const typing = document.createElement('div');
            typing.className = 'message bot';
            typing.innerHTML = '<em>Nurse Rachel is typing...</em>';
            chatMessages.appendChild(typing);

            if (isLocal) {
                const aiResp = await callGemini(msg);
                if (chatMessages.contains(typing)) chatMessages.removeChild(typing);
                if (aiResp) appendMessage('bot', aiResp);
                else appendMessage('bot', getClinicalResponse(msg));
            } else {
                setTimeout(() => {
                    if (chatMessages.contains(typing)) chatMessages.removeChild(typing);
                    appendMessage('bot', getClinicalResponse(msg));
                }, 800);
            }
        });
    }

    // ─── Hero Background ───
    const slides = document.querySelectorAll('.hero-bg-slide');
    if (slides.length > 0) {
        let cur = 0;
        setInterval(() => {
            slides[cur].classList.remove('active');
            cur = (cur + 1) % slides.length;
            slides[cur].classList.add('active');
        }, 5000);
    }
});
