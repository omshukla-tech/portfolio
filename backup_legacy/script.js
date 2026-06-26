document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouse = { x: -100, y: -100 };
    let lastMousePos = { x: 0, y: 0 };
    let lastMoveTime = Date.now();

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        lastMoveTime = Date.now();
    });

    const updateCursor = () => {
        
        cursorDot.style.left = `${mouse.x}px`;
        cursorDot.style.top = `${mouse.y}px`;

    
        const outlineX = parseFloat(cursorOutline.style.left || mouse.x);
        const outlineY = parseFloat(cursorOutline.style.top || mouse.y);
        cursorOutline.style.left = `${outlineX + (mouse.x - outlineX) * 0.1}px`;
        cursorOutline.style.top = `${outlineY + (mouse.y - outlineY) * 0.1}px`;

        
        const velocity = Math.hypot(mouse.x - lastMousePos.x, mouse.y - lastMousePos.y);
        lastMousePos = { x: mouse.x, y: mouse.y };

        
        const particlesToCreate = Math.min(Math.floor(velocity / 4), 5);
        for (let i = 0; i < particlesToCreate; i++) {
            createParticle(mouse.x, mouse.y);
        }

        
        if (Date.now() - lastMoveTime > 150) {
             createParticle(mouse.x, mouse.y, true);
        }

        requestAnimationFrame(updateCursor);
    };

    const createParticle = (x, y, isIdle = false) => {
        const particle = document.createElement('div');
        particle.classList.add('trail-particle');

        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        const offsetX = (Math.random() - 0.5) * (isIdle ? 10 : 20);
        const offsetY = (Math.random() - 0.5) * (isIdle ? 10 : 20);
        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY}px`;

        body.appendChild(particle);

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    };

    updateCursor();


    
    const interactiveElements = document.querySelectorAll('.interactive');
    interactiveElements.forEach(elem => {
        elem.addEventListener('mousemove', e => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y / rect.height - 0.5) * -20;
            const rotateY = (x / rect.width - 0.5) * 20;
            elem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    
    const themeToggle = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'light') body.classList.add('light-mode');
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
        setupParticles();
    });

    new Typed('#typing-effect', { strings: ['Front-end Developer', 'Problem Solver', 'Quick Learner'], typeSpeed: 50, backSpeed: 25, backDelay: 1500, loop: true });
    AOS.init({ duration: 800, once: true, offset: 50 });

    function setupParticles() {
        const isLight = body.classList.contains('light-mode');
        particlesJS('particles-js', { particles: { number: { value: 40 }, color: { value: isLight ? '#888888' : '#ffffff' }, opacity: { value: 0.2 }, size: { value: 3 }, line_linked: { enable: true, color: isLight ? '#aaaaaa' : '#ffffff', opacity: 0.2 }, move: { speed: 2 } }, interactivity: { events: { onhover: { enable: false } } } });
    }
    setupParticles();

  const projects = [

        {
            name: "Krishna-Ji Chatbot",
            bio: "A ChatGPT inspired chat bot with the knowledge of Geeta, built in Html, css, js etc.",
            img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=8",
            previewLink: "https://krishnaji-by-om-shukla.vercel.app/",
            codeLink: "https://github.com/omShukla0711/krishna"
        },
        {
            name: "Unique Portfolio Website",
            bio: "A creative  portfolio system designed from scratch without templates.",
            img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=80",
            previewLink: "#",
            codeLink: "https://github.com/omShukla0711/portfolio"
        },
      {
            name: "Love- Site",
            bio: "A demo of a greate purposal site for your crush. Made in HTML,CSS,JS,WEBGL,REACT ETC...",
            img: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg",
            previewLink: "https://princess-aditi.vercel.app",
            codeLink: "https://github.com/omShukla0711/cute-aditi"
        },
          {
            name: "Birthday",
            bio: "A birthday wish for my friend Sanya using web technology",
            img: "https://images.unsplash.com/photo-1619597455322-4fbbd820250a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGVza3RvcHxlbnwwfHwwfHx8MA%3D%3D",
            previewLink: "https://happy-bddy-sanya.vercel.app/",
            codeLink: "https://github.com/omShukla0711/birthdayy"
        },
    
      
    ];

    const projectContainer = document.getElementById('project-container');

    projects.forEach(project => {
        const projectCard = `
            <div class="project-card" data-aos="fade-up">
                <img src="${project.img}" alt="${project.name}">
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>${project.bio}</p>
                    <div class="project-links">
                        <a href="${project.previewLink}" target="_blank">Preview <i class="fas fa-external-link-alt"></i></a>
                        <a href="${project.codeLink}" target="_blank">Code <i class="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
        `;
        projectContainer.innerHTML += projectCard;
    });

});
// In your script.js file
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});

// --- Custom Cursor & Trail ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const interactiveElements = document.querySelectorAll('.interactive'); // Select all interactive elements

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    // Trail effect
    createTrailParticle(mouseX, mouseY);
});

function animateCursorOutline() {
    outlineX += (mouseX - outlineX) / 8; // Adjust division for speed
    outlineY += (mouseY - outlineY) / 8;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateCursorOutline);
}
animateCursorOutline();

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'trail-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = '10px'; // Initial size
    particle.style.height = '10px';
    particle.style.opacity = '0.7'; // Initial opacity

    // Use current cursor color for trail
    const currentCursorColor = cursorDot.style.backgroundColor || getComputedStyle(cursorDot).backgroundColor;
    particle.style.backgroundColor = currentCursorColor;

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 800); // Match animation duration
}

// --- Dynamic Interactive Element Colors & Cursor Hover States ---

// Function to generate a vibrant, random color
function getRandomVibrantColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = '90%'; // High saturation for vibrancy
    const lightness = '60%'; // Mid-lightness
    return `hsl(${hue}, ${saturation}, ${lightness})`;
}

// Function to convert HSL to RGBA for glow effects
function hslToRgba(hsl, alpha = 0.5) {
    const parts = hsl.match(/\d+/g).map(Number);
    const h = parts[0];
    const s = parts[1] / 100;
    const l = parts[2] / 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Assign unique colors and event listeners to interactive elements
interactiveElements.forEach(el => {
    const uniqueColor = getRandomVibrantColor();
    const uniqueColorRgba = hslToRgba(uniqueColor, 0.5); // For glow
    const uniqueColorRgb = hslToRgba(uniqueColor, 1).replace('rgba(', '').replace(', 1)', ''); // For individual R,G,B values

    // Set CSS variables on the element for CSS hover effects
    el.style.setProperty('--hover-border-color', uniqueColor);
    el.style.setProperty('--hover-glow-color-rgba', uniqueColorRgba);
    el.style.setProperty('--hover-glow-color-rgb', uniqueColorRgb); // For box-shadow with individual values

    el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovered');
        cursorOutline.classList.add('hovered');
        // Apply the element's unique color to the cursor
        cursorDot.style.setProperty('--element-hover-color', uniqueColor);
        cursorOutline.style.setProperty('--element-hover-color', uniqueColor);
        // Also set RGB for cursor outline glow
        cursorOutline.style.setProperty('--element-hover-color-rgb', uniqueColorRgb);
    });

    el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovered');
        cursorOutline.classList.remove('hovered');
        // Reset cursor color to primary if no other interactive element is hovered
        cursorDot.style.removeProperty('--element-hover-color');
        cursorOutline.style.removeProperty('--element-hover-color');
        cursorOutline.style.removeProperty('--element-hover-color-rgb');
    });
});
