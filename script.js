document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. PRELOADER ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => { preloader.style.opacity = '0'; setTimeout(() => { preloader.style.display = 'none'; }, 500); }, 2200);
    }

    // --- 2. CUSTOM CURSOR ---
    const cursor = document.getElementById('custom-cursor');
    if (window.matchMedia("(pointer: fine)").matches && cursor) {
        document.addEventListener('mousemove', (e) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; });
        document.querySelectorAll('.hover-trigger, a, button, input, textarea, .menu-toggle, .ai-chip').forEach(t => {
            t.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            t.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // --- 3. TERMINAL LOGIC ---
    const terminal = document.getElementById('terminal-overlay');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const closeTerminal = document.getElementById('close-terminal');
    const terminalTrigger = document.getElementById('terminal-trigger');
    const scrollArea = document.getElementById('terminal-scroll-area');
    let isTerminalOpen = false;

    function typeText(element, text, speed = 15) {
        let i = 0;
        const interval = setInterval(() => { element.textContent += text.charAt(i); i++; scrollArea.scrollTop = scrollArea.scrollHeight; if (i >= text.length) clearInterval(interval); }, speed);
    }
    function printOutput(text, isHTML = false) {
        const div = document.createElement('div'); div.className = "terminal-line";
        if (isHTML) div.innerHTML = text; else typeText(div, text);
        terminalOutput.appendChild(div); scrollArea.scrollTop = scrollArea.scrollHeight;
    }
    function openTerminal() {
        if (isTerminalOpen) return; terminal.classList.add('active'); isTerminalOpen = true;
        if(terminalOutput.innerHTML === "") { printOutput("Initializing DS_OS v1.0...", false); setTimeout(() => printOutput("System Ready. Type 'help' for commands.", false), 800); }
        setTimeout(() => { terminalInput.focus(); scrollArea.scrollTop = scrollArea.scrollHeight; }, 600);
    }
    function closeTerminalFunc() { terminal.classList.remove('active'); isTerminalOpen = false; terminalInput.blur(); }
    window.addEventListener('resize', () => { if (isTerminalOpen) { scrollArea.scrollTop = scrollArea.scrollHeight; terminalInput.scrollIntoView({ behavior: "smooth", block: "end" }); } });
    if (terminal) terminal.addEventListener('click', () => { if (isTerminalOpen) terminalInput.focus(); });
    document.addEventListener('keydown', (e) => { if (e.key === '`' || e.key === '~') { e.preventDefault(); isTerminalOpen ? closeTerminalFunc() : openTerminal(); } if (e.key === 'Escape' && isTerminalOpen) closeTerminalFunc(); });
    if (closeTerminal) closeTerminal.addEventListener('click', closeTerminalFunc);
    if (terminalTrigger) terminalTrigger.addEventListener('click', openTerminal);

    if (terminalInput) {
        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.toLowerCase().trim();
                const userLine = document.createElement('div'); userLine.className = "terminal-line";
                userLine.innerHTML = `<span style="color:#27c93f">➜</span> <span style="color:#fff">${cmd}</span>`;
                terminalOutput.appendChild(userLine); terminalInput.value = '';
                setTimeout(() => {
                    if (cmd === 'help') printOutput("Available commands: about, contact, skills, clear, exit");
                    else if (cmd === 'about') printOutput("Deepak Sharma. System Architect. Logic-First Developer.");
                    else if (cmd === 'contact') printOutput("Email: sharma05deep@gmail.com | Location: Rajasthan, India");
                    else if (cmd === 'skills') printOutput("AI, Python, C++, System Design, Algorithms.");
                    else if (cmd === 'clear') terminalOutput.innerHTML = '';
                    else if (cmd === 'exit') closeTerminalFunc();
                    else printOutput(`Command not found: ${cmd}`);
                }, 100);
            }
        });
    }

    // --- 4. UPGRADED AI WIDGET ---
    const aiTrigger = document.getElementById('ai-trigger');
    const aiWidget = document.getElementById('ai-widget');
    const closeAi = document.getElementById('close-ai');
    const aiMessages = document.getElementById('ai-messages');
    const aiControls = document.getElementById('ai-controls');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiLabel = document.getElementById('ai-label');

    // Knowledge Base
    const aiKnowledge = {
        default: "I'm not sure about that, but I can tell you about Deepak's skills, projects, or how to contact him.",
        greetings: ["hi", "hello", "hey", "greetings"],
        skills: ["skills", "stack", "tech", "languages", "code"],
        contact: ["contact", "email", "phone", "reach", "hire"],
        projects: ["projects", "work", "portfolio", "indus", "app"],
        about: ["who", "about", "bio", "story"]
    };

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    }

    function addMessage(text, sender = 'ai') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}`;
        msgDiv.innerHTML = text;
        aiMessages.appendChild(msgDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    function showTyping() {
        const dots = document.createElement('div'); dots.className = 'typing-dots'; dots.id = 'typing-indicator';
        dots.innerHTML = '<span></span><span></span><span></span>';
        aiMessages.appendChild(dots); aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    function removeTyping() { const dots = document.getElementById('typing-indicator'); if (dots) dots.remove(); }

    function initChat() {
        if (aiMessages.children.length === 0) {
            showTyping();
            setTimeout(() => {
                removeTyping();
                addMessage(`${getGreeting()}! I am Deepak's Digital Assistant. Ask me anything or choose an option below.`);
                renderOptions();
            }, 1000);
        }
    }

    function renderOptions() {
        const options = [
            { label: "Why hire Deepak?", text: "Deepak combines strong CS fundamentals with AI-driven workflows to build resilient, scalable systems." },
            { label: "Tech Stack", text: "Python, C++, JavaScript, Linux, Git, and LLM Integration." },
            { label: "Contact Info", text: "Email: sharma05deep@gmail.com <br> Location: Borana, Rajasthan." }
        ];
        aiControls.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button'); btn.className = 'ai-chip hover-trigger'; btn.textContent = opt.label;
            btn.onclick = () => { handleUserResponse(opt.label); processAiResponse(opt.text); };
            aiControls.appendChild(btn);
        });
    }

    function handleUserResponse(text) {
        addMessage(text, 'user');
        aiInput.value = '';
    }

    function processAiResponse(responseText = null) {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addMessage(responseText || aiKnowledge.default, 'ai');
        }, 800);
    }

    function processCommand(text) {
        text = text.toLowerCase();
        let response = aiKnowledge.default;
        
        if (aiKnowledge.greetings.some(k => text.includes(k))) response = `${getGreeting()}! How can I help you today?`;
        else if (aiKnowledge.skills.some(k => text.includes(k))) response = "Deepak is proficient in Python, C++, JavaScript, System Design, and AI Integration.";
        else if (aiKnowledge.contact.some(k => text.includes(k))) response = "You can contact him at sharma05deep@gmail.com or use the form on this page.";
        else if (aiKnowledge.projects.some(k => text.includes(k))) response = "He has worked on 'Indus AI', Logic Prototypes, and various AI Automation workflows.";
        else if (aiKnowledge.about.some(k => text.includes(k))) response = "Deepak is a self-taught System Architect from Rajasthan, driven by logic and curiosity.";

        processAiResponse(response);
    }

    if (aiTrigger) {
        aiTrigger.addEventListener('click', () => {
            aiWidget.classList.toggle('active');
            if (aiWidget.classList.contains('active')) {
                initChat();
                if(aiLabel) aiLabel.style.display = 'none'; // Hide label once opened
            }
        });
    }
    if (closeAi) closeAi.addEventListener('click', () => aiWidget.classList.remove('active'));

    // Input Handling
    function handleInput() {
        const text = aiInput.value.trim();
        if (!text) return;
        handleUserResponse(text);
        processCommand(text);
    }
    
    if (aiSend) aiSend.addEventListener('click', handleInput);
    if (aiInput) aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleInput(); });


    // --- 5. CONTACT FORM (AJAX) ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn'); const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span><i class="ph ph-spinner ph-spin"></i>'; submitBtn.disabled = true; formStatus.textContent = "";
            const formData = new FormData(contactForm);
            try {
                const response = await fetch("https://formsubmit.co/ajax/sharma05deep@gmail.com", { method: "POST", body: formData });
                if (response.ok) {
                    formStatus.style.color = "#2dd4bf"; formStatus.textContent = "Message received. I will respond shortly.";
                    contactForm.reset(); setTimeout(() => { submitBtn.innerHTML = "<span>Message Sent</span><i class='ph ph-check'></i>"; setTimeout(() => { submitBtn.innerHTML = originalBtnText; submitBtn.disabled = false; formStatus.textContent = ""; }, 2000); }, 500);
                } else { throw new Error("Server Error"); }
            } catch (error) { console.error(error); formStatus.style.color = "#ef4444"; formStatus.textContent = "Something went wrong."; submitBtn.innerHTML = originalBtnText; submitBtn.disabled = false; }
        });
    }

    // --- 6. STORY TOGGLE ---
    const readMoreBtn = document.getElementById('readMoreBtn'); const storyContent = document.getElementById('about-story');
    if (readMoreBtn && storyContent) {
        readMoreBtn.addEventListener('click', () => {
            storyContent.classList.toggle('expanded');
            readMoreBtn.textContent = storyContent.classList.contains('expanded') ? "Close Journey ↑" : "Read My Journey ↓";
            if(!storyContent.classList.contains('expanded')) document.getElementById('summary').scrollIntoView({behavior: "smooth"});
        });
    }

    // --- 7. NEURAL CANVAS ---
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d'); let width, height, particles = []; const particleCount = 40; const connectionDistance = 150; const mouseDistance = 200;
        function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
        window.addEventListener('resize', resize); resize();
        const mouse = { x: null, y: null }; window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
        class Particle { constructor() { this.x = Math.random() * width; this.y = Math.random() * height; this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5; this.size = Math.random() * 2 + 1; } update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > width) this.vx *= -1; if (this.y < 0 || this.y > height) this.vy *= -1; } draw() { ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); } }
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        function animate() { ctx.clearRect(0, 0, width, height); particles.forEach((p, index) => { p.update(); p.draw(); for (let j = index; j < particles.length; j++) { const p2 = particles[j]; const dist = Math.hypot(p.x - p2.x, p.y - p2.y); if (dist < connectionDistance) { ctx.beginPath(); ctx.strokeStyle = `rgba(45, 212, 191, ${1 - dist / connectionDistance})`; ctx.lineWidth = 0.5; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); } } if (mouse.x != null) { const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y); if (dist < mouseDistance) { ctx.beginPath(); ctx.strokeStyle = `rgba(45, 212, 191, ${1 - dist / mouseDistance})`; ctx.lineWidth = 0.5; ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); } } }); requestAnimationFrame(animate); } animate();
    }

    // --- 8. TYPING ENGINE ---
    const textElement = document.querySelector(".typing-text"); const words = ["Logic", "Clarity", "Intelligence"]; 
    if (textElement) { let wordIndex = 0, charIndex = 0, isDeleting = false, lastTime = 0, delay = 200; function typeLoop(currentTime) { if (!lastTime) lastTime = currentTime; const deltaTime = currentTime - lastTime; if (deltaTime > delay) { const currentWord = words[wordIndex]; if (isDeleting) { textElement.textContent = currentWord.substring(0, charIndex - 1); charIndex--; delay = 50; } else { textElement.textContent = currentWord.substring(0, charIndex + 1); charIndex++; delay = 150; } if (!isDeleting && charIndex === currentWord.length) { isDeleting = true; delay = 2000; } else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 500; } lastTime = currentTime; } requestAnimationFrame(typeLoop); } requestAnimationFrame(typeLoop); }

    // --- 9. MOBILE MENU ---
    const menuToggle = document.getElementById('mobile-menu'); const mobileDropdown = document.getElementById('mobile-dropdown'); const toggleScrollLock = (isLocked) => { document.body.style.overflow = isLocked ? 'hidden' : ''; };
    if (menuToggle) { menuToggle.addEventListener('click', () => { menuToggle.classList.toggle('active'); mobileDropdown.classList.toggle('active'); toggleScrollLock(mobileDropdown.classList.contains('active')); }); }
    document.querySelectorAll('.mobile-link').forEach(link => { link.addEventListener('click', () => { menuToggle.classList.remove('active'); mobileDropdown.classList.remove('active'); toggleScrollLock(false); }); });
    const mobileTerminalBtn = document.getElementById('mobile-terminal-btn'); if (mobileTerminalBtn) { mobileTerminalBtn.addEventListener('click', () => { setTimeout(() => openTerminal(), 300); }); }

    // --- 10. UTILS ---
    window.addEventListener('scroll', () => { const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight; if (scrollTotal > 0) { const pct = (document.documentElement.scrollTop / scrollTotal) * 100; const bar = document.querySelector('.scroll-progress'); if (bar) bar.style.width = pct + "%"; } });
    document.querySelectorAll('.tilt-card').forEach(card => { card.addEventListener('mousemove', (e) => { const rect = card.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const cx = rect.width / 2; const cy = rect.height / 2; const rx = (cy - y) / 20; const ry = (x - cx) / 20; card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`; }); card.addEventListener('mouseleave', () => { card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`; }); });
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); }, { threshold: 0.1 }); document.querySelectorAll(".scroll-trigger, .anim-hidden").forEach(el => observer.observe(el));
    const smoothScroll = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({behavior:"smooth"}); };
    document.getElementById("viewProjectsBtn")?.addEventListener("click", () => smoothScroll("projects")); document.getElementById("contactBtn")?.addEventListener("click", () => smoothScroll("contactSection")); document.getElementById("navContactBtn")?.addEventListener("click", () => smoothScroll("contactSection"));
});
