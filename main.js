document.addEventListener('DOMContentLoaded', () => {

    // ─── Hero loaded animation ───
    const hero = document.querySelector('.hero');
    if (hero) {
        requestAnimationFrame(() => hero.classList.add('loaded'));
    }

    // ─── Header scroll behavior ───
    const header = document.getElementById('siteHeader');
    let lastScroll = 0;

    function onScroll() {
        const y = window.scrollY;
        if (header) {
            if (y > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        lastScroll = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    // ─── Mobile Navigation ───
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navClose = document.getElementById('navClose');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    // Close on nav link click
    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ─── Active nav link on scroll ───
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ─── Smooth scroll for all anchor links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ─── Reveal on scroll (Intersection Observer) ───
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── Form submissions ───
    const forms = {
        assessmentForm: 'Thank you! Your assessment request has been submitted. A Heritage Health care coordinator will contact you shortly.',
        contactForm: 'Message sent! We typically respond within one business day.'
    };

    Object.entries(forms).forEach(([id, message]) => {
        const form = document.getElementById(id);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                const original = btn.textContent;
                btn.textContent = '✓ Submitted';
                btn.style.opacity = '0.7';
                btn.disabled = true;

                setTimeout(() => {
                    alert(message);
                    btn.textContent = original;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                    form.reset();
                }, 400);
            });
        }
    });

    // Portal form → redirect to portal
    const portalForm = document.getElementById('portalForm');
    if (portalForm) {
        portalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = portalForm.querySelector('button[type="submit"]');
            btn.textContent = 'Signing In...';
            btn.style.opacity = '0.7';
            btn.disabled = true;
            setTimeout(() => {
                window.location.href = 'portal.html';
            }, 800);
        });
    }

    // ─── Chatbot ───
    const chatBubble = document.getElementById('chatBubble');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    // System Prompt for Clinical Persona
    const SYSTEM_PROMPT = `You are the Heritage Health Services clinical support AI. 
    Your persona: Professional, RN-led, authoritative yet compassionate.
    Context: Heritage Health Services is a premium personal care agency in Southeast Wisconsin (serving Milwaukee, Racine, Kenosha, and surrounding counties).
    Key Topics:
    1. 'Get Paid to Care' program: Family/friends can be paid PCWs through Medicaid/Title 19.
    2. RN-led Assessments: We offer free in-home assessments.
    3. Services: ADLs, transfers, hygiene, morning/evening routines, etc.
    4. Compliance: We emphasize clinical transparency and ethical care.
    Guidelines: 
    - Keep responses concise (under 3 sentences unless complex).
    - Always recommend a free RN assessment for specific medical inquiries.
    - Mention (262) 554-8800 for immediate support.
    - If you don't know something, refer them to a human coordinator.`;

    let GEMINI_API_KEY = sessionStorage.getItem('HHS_CHAT_KEY');

    async function callGemini(userMessage) {
        if (!GEMINI_API_KEY) {
            GEMINI_API_KEY = prompt("To enable Real AI Chat, please enter your Gemini API Key (This is stored only in your current session):");
            if (GEMINI_API_KEY) sessionStorage.setItem('HHS_CHAT_KEY', GEMINI_API_KEY);
            else return null;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}` }]
                }]
            })
        });

        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    if (chatBubble) {
        chatBubble.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                chatInput.focus();
            }
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            appendMessage('user', message);
            chatInput.value = '';

            // Typing indicator
            const typing = document.createElement('div');
            typing.className = 'message bot';
            typing.innerHTML = '<em style="opacity:0.5;">typing...</em>';
            chatMessages.appendChild(typing);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                // Try Gemini First
                const aiResponse = await callGemini(message);
                chatMessages.removeChild(typing);
                
                if (aiResponse) {
                    appendMessage('bot', aiResponse);
                } else {
                    // Fallback if they cancelled the prompt
                    handleFallback(message);
                }
            } catch (err) {
                console.error("Gemini Error:", err);
                chatMessages.removeChild(typing);
                handleFallback(message);
            }
        });
    }

    function handleFallback(message) {
        const lower = message.toLowerCase();
        let response;

        if (lower.includes('caregiver') || lower.includes('paid') || lower.includes('pay')) {
            response = "Through our 'Get Paid to Care' program, family members and friends can often be compensated for providing care! Individuals who receive Title 19 or Medicaid have the right to choose their own personal care aid. Would you like to learn more about enrollment?";
        } else if (lower.includes('assessment') || lower.includes('new') || lower.includes('start') || lower.includes('enroll')) {
            response = "We offer free in-home Registered Nurse assessments across all of Southeast Wisconsin. You can download the New Client Form, Medical Release, and Wheaton Release in our 'New Clients' section, or I can help you schedule one directly.";
        } else if (lower.includes('service') || lower.includes('help') || lower.includes('care')) {
            response = "We offer a full range of personal care services including morning & evening routines, transfer assistance, dressing help, personal hygiene, incontinence care, and bathing & showering assistance. All with a Registered Nurse-led support team. Would you like details on any specific service?";
        } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('address') || lower.includes('office')) {
            response = "You can reach us at (262) 554-8800, email Info@wihhs.com, or visit us at 5331 Spring St. Suite 101, Mt. Pleasant, WI 53406. Our office hours are Monday – Friday, 10am to 4pm.";
        } else if (lower.includes('county') || lower.includes('area') || lower.includes('where') || lower.includes('location')) {
            response = "We proudly serve Milwaukee, Racine, Kenosha, Dane, Dodge, Jefferson, Ozaukee, Rock, Walworth, Washington, and Waukesha Counties in Wisconsin.";
        } else {
            response = "Thank you for your inquiry. A Heritage Health care coordinator would be happy to discuss that with you. You can call us at (262) 554-8800 or would you like me to help you schedule a free home assessment?";
        }

        appendMessage('bot', response);
    }
            }, 900);
        });
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ─── Parallax effect on hero background ───
    const heroBg = document.querySelector('.hero-bg-container');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroBg.style.transform = `scale(1.05) translateY(${y * 0.15}px)`;
            }
        }, { passive: true });
    }

    // ─── Hero Background Carousel ───
    const slides = document.querySelectorAll('.hero-bg-slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 10000); // 10 seconds
    }

});
