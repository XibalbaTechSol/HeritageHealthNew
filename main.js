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

    function getClinicalResponse(msg) {
        const lower = msg.toLowerCase();
        
        if (lower.includes('caregiver') || lower.includes('paid') || lower.includes('pay')) {
            return "As an RN, I can confirm that Wisconsin Medicaid offers a path for family members to be compensated for providing essential care. To begin, we establish 'Medical Necessity' through a physician’s order and a professional nursing assessment. Would you like to schedule a free RN consultation to see if you qualify?";
        }
        
        if (lower.includes('assessment') || lower.includes('start') || lower.includes('enroll')) {
            return "Our enrollment process starts with a free in-home nursing assessment. We evaluate Activities of Daily Living (ADLs) to create a personalized Plan of Care. You can call our clinical team at (262) 554-8800 to set this up, or download the enrollment forms in our 'New Clients' section.";
        }

        if (lower.includes('hmo') || lower.includes('title 19') || lower.includes('insurance')) {
            return "We work with both Straight Title 19 (Fee-for-Service) and most major Medicaid HMOs like iCare and UnitedHealthcare. The main difference is how care is authorized. Our intake team acts as your administrative advocate to navigate these specific insurance requirements.";
        }

        if (lower.includes('area') || lower.includes('county') || lower.includes('racine') || lower.includes('milwaukee')) {
            return "Heritage Health proudly serves the South East Wisconsin region, including Milwaukee, Racine, and Kenosha counties. Our local office is in Sturtevant, and our nurses travel directly to your home throughout the area.";
        }

        if (lower.includes('mapp')) {
            return "The MAPP program is an excellent tool for adults with disabilities who wish to work while maintaining full Medicaid coverage. It offers a higher asset limit ($15,000) and allows you to save for the future without losing your personal care benefits.";
        }

        return "Thank you for reaching out. As clinical needs are unique to every family, I recommend speaking with one of our Heritage Health care coordinators at (262) 554-8800. They can provide specific guidance tailored to your loved one’s condition.";
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (!msg) return;

            appendMessage('user', msg);
            chatInput.value = '';

            // Typing indicator
            const typing = document.createElement('div');
            typing.className = 'message bot';
            typing.innerHTML = '<em>Nurse Rachel is typing...</em>';
            chatMessages.appendChild(typing);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(() => {
                if (chatMessages.contains(typing)) chatMessages.removeChild(typing);
                const response = getClinicalResponse(msg);
                appendMessage('bot', response);
            }, 1000);
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
