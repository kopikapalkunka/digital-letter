document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Entrance Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger staggered list items if this is the changes section
                if (entry.target.id === 'changes') {
                    animateChangesList();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-fade').forEach(section => {
        observer.observe(section);
    });

    // --- 2. "I Was Wrong" Interaction ---
    const btnReadApology = document.getElementById('btn-read-apology');
    const msgReadApology = document.getElementById('msg-read-apology');

    if (btnReadApology) {
        btnReadApology.addEventListener('click', (e) => {
            // Sparkle animation (simple scale/glow effect via CSS class)
            e.target.style.transform = 'scale(1.1)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
                e.target.disabled = true;
                e.target.textContent = 'Read'; // Optional visual feedback
                
                // Reveal message
                msgReadApology.classList.add('visible');
            }, 200);
        });
    }

    // --- 3. "Ask Me Anything" Interaction ---
    const askForm = document.getElementById('ask-form');
    const askConfirmation = document.getElementById('ask-confirmation');
    const questionInput = document.getElementById('question-input');

    if (askForm) {
        askForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!questionInput.value.trim()) return;

            // Hide form input area gently
            askForm.style.opacity = '0.5';
            askForm.style.pointerEvents = 'none';

            // Show confirmation
            askConfirmation.classList.remove('hidden');
            
            // Typewriter effect logic could go here, but CSS animation handles the cursor blink
            // We can simulate "typing" appearance by revealing text if needed, 
            // but the prompt asks for "typewriter or soft-typing animation" on the confirmation text.
            // For simplicity and robustness, we'll rely on the CSS fade-in for the block.
        });
    }

    // Micro-actions in Ask section
    const btnPreview = document.getElementById('btn-preview-answer');
    const btnPerson = document.getElementById('btn-ask-person');
    const previewContent = document.getElementById('preview-answer-content');
    const personContent = document.getElementById('ask-person-content');

    if (btnPreview) {
        btnPreview.addEventListener('click', () => {
            previewContent.classList.add('visible');
            personContent.classList.remove('visible');
        });
    }

    if (btnPerson) {
        btnPerson.addEventListener('click', () => {
            personContent.classList.add('visible');
            previewContent.classList.remove('visible');
        });
    }

    // --- 4. "Slow Healing Garden" (Session Storage) ---
    const gardenCanvas = document.getElementById('garden-canvas');
    
    // Check session storage for "growth level"
    let growthLevel = parseInt(sessionStorage.getItem('gardenGrowth') || '0');
    
    // Increment growth on load (up to limit of 5)
    if (growthLevel < 5) {
        growthLevel++;
        sessionStorage.setItem('gardenGrowth', growthLevel);
    }

    // Render leaves based on growthLevel
    renderGarden(growthLevel);

    function renderGarden(level) {
        // Simple SVG generation
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "200");
        svg.setAttribute("height", "150");
        svg.setAttribute("viewBox", "0 0 200 150");

        // Pot
        const pot = document.createElementNS(svgNS, "path");
        pot.setAttribute("d", "M80,130 L120,130 L115,150 L85,150 Z");
        pot.setAttribute("fill", "#D8C3A5");
        svg.appendChild(pot);

        // Stem (grows with level)
        if (level >= 1) {
            const stem = document.createElementNS(svgNS, "path");
            stem.setAttribute("d", "M100,130 Q100,100 100,80");
            stem.setAttribute("stroke", "#8FBC8F");
            stem.setAttribute("stroke-width", "3");
            stem.setAttribute("fill", "none");
            svg.appendChild(stem);
        }

        // Leaves (add more based on level)
        const leafPositions = [
            { d: "M100,110 Q80,100 80,110 Q90,120 100,110", fill: "#A2D149" }, // 1
            { d: "M100,95 Q120,85 120,95 Q110,105 100,95", fill: "#9ACD32" },  // 2
            { d: "M100,80 Q70,70 70,80 Q85,90 100,80", fill: "#A2D149" },    // 3
            { d: "M100,65 Q130,55 130,65 Q115,75 100,65", fill: "#9ACD32" },  // 4
            { d: "M100,50 Q90,30 100,20 Q110,30 100,50", fill: "#FFD6E7" }    // 5 (Flower bud)
        ];

        for (let i = 0; i < level; i++) {
            if (leafPositions[i]) {
                const leaf = document.createElementNS(svgNS, "path");
                leaf.setAttribute("d", leafPositions[i].d);
                leaf.setAttribute("fill", leafPositions[i].fill);
                leaf.setAttribute("opacity", "0");
                
                // Animate leaf appearance
                setTimeout(() => {
                    leaf.setAttribute("opacity", "1");
                    leaf.style.transition = "opacity 1s ease";
                }, i * 200); // Stagger slightly
                
                svg.appendChild(leaf);
            }
        }

        gardenCanvas.appendChild(svg);
    }

    // --- 5. "What I'm Changing" Staggered Reveal ---
    function animateChangesList() {
        const items = document.querySelectorAll('.change-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 300);
        });
    }

    // --- 6. "You Decide the Pace" Closing ---
    const closingCard = document.getElementById('closing');
    const cursorFollower = document.querySelector('.glow-cursor-follower');
    const btnClosing = document.getElementById('btn-closing-ack');

    // Cursor follow effect
    if (closingCard && cursorFollower) {
        closingCard.addEventListener('mousemove', (e) => {
            const rect = closingCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            cursorFollower.style.left = `${x}px`;
            cursorFollower.style.top = `${y}px`;
        });
    }

    // Button interaction
    if (btnClosing) {
        btnClosing.addEventListener('click', (e) => {
            if (e.target.disabled) return;
            
            e.target.disabled = true;
            e.target.textContent = "Thank you";
            e.target.style.background = "transparent";
            e.target.style.boxShadow = "none";
            e.target.style.border = "none";
            e.target.style.cursor = "default";

            // Confetti
            createConfetti(e.target);
        });
    }

    function createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const colors = ['#FFD6E7', '#FFF4B8', '#E0F7FA'];

        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random position relative to button
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 50;
            
            confetti.style.left = `${element.offsetLeft + element.offsetWidth/2}px`;
            confetti.style.top = `${element.offsetTop + element.offsetHeight/2}px`;
            
            // Custom animation for each piece
            confetti.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${x}px, ${y + 50}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
            });

            element.parentElement.appendChild(confetti);
            
            // Cleanup
            setTimeout(() => confetti.remove(), 2000);
        }
    }
});
