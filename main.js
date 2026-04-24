/**
 * MAIN INTERACTION LOGIC — Heritage Health Services
 * Handles UI, scroll effects, and Dual-Mode Clinical Chatbot.
 */

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

    // --- LOCAL MODE: REAL AI (Standard Fetch API) ---
    async function callGeminiLocal(msg) {
        let key = sessionStorage.getItem('HHS_CHAT_KEY');
        if (!key) {
            key = prompt("Real AI Mode (Local Only). Please enter your Gemini API Key:");
            if (key) sessionStorage.setItem('HHS_CHAT_KEY', key);
            else return null;
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${msg}` }] }]
                })
            });
            const data = await resp.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            console.error("AI Error:", e);
            return null;
        }
    }

    // --- PRODUCTION MODE: FALLBACK ---
    function getClinicalResponse(msg) {
        const lower = msg.toLowerCase();
        if (lower.includes('caregiver') || lower.includes('paid') || lower.includes('pay')) {
            return "As an RN, I can confirm that Wisconsin Medicaid offers a path for family members to be compensated for providing essential care. To begin, we establish 'Medical Necessity' through a physician’s order and a professional nursing assessment. Would you like to schedule a free RN consultation?";
        }
        if (lower.includes('assessment') || lower.includes('start') || lower.includes('enroll')) {
            return "Our enrollment process starts with a free in-home nursing assessment. We evaluate Activities of Daily Living (ADLs) to create a personalized Plan of Care. You can call our clinical team at (262) 554-8800 to set this up.";
        }
        if (lower.includes('hmo') || lower.includes('title 19')) {
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
                const aiResp = await callGeminiLocal(msg);
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
