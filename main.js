document.addEventListener('DOMContentLoaded', () => {

    // ─── UTILS ───
    function safeAddListener(id, event, callback) {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, callback);
    }

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
            if (targetId === '#') return;
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

    // ─── Portal Form Simulation ───
    const portalForm = document.getElementById('portalForm');
    if (portalForm) {
        portalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = portalForm.querySelector('button[type="submit"]');
            btn.textContent = 'Signing In...';
            btn.style.opacity = '0.7';
            btn.disabled = true;
            setTimeout(() => { window.location.href = 'portal.html'; }, 800);
        });
    }

    // ─── Chatbot ───
    const chatBubble = document.getElementById('chatBubble');
    const chatWindow = document.getElementById('chatWindow');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    const SYSTEM_PROMPT = "You are the Heritage Health Services clinical support AI. Be professional and compassionate. If you don't know something, refer them to (262) 554-8800.";

    if (chatBubble && chatWindow) {
        chatBubble.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active') && chatInput) chatInput.focus();
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
            key = prompt("Please enter your Gemini API Key to enable AI chat:");
            if (key) sessionStorage.setItem('HHS_CHAT_KEY', key);
            else return null;
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${msg}` }] }] })
            });
            const data = await resp.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    function handleFallback(message) {
        const lower = message.toLowerCase();
        let response = "Thank you for your inquiry. Please call us at (262) 554-8800 for immediate assistance.";
        if (lower.includes('caregiver') || lower.includes('paid')) {
            response = "Family members can often be paid to provide care through Medicaid! Contact us to learn about enrollment.";
        } else if (lower.includes('assessment')) {
            response = "We offer free in-home RN assessments. Would you like to schedule one?";
        }
        appendMessage('bot', response);
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
            typing.innerHTML = '<em>typing...</em>';
            chatMessages.appendChild(typing);

            const aiResp = await callGemini(msg);
            if (chatMessages.contains(typing)) chatMessages.removeChild(typing);

            if (aiResp) appendMessage('bot', aiResp);
            else handleFallback(msg);
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
