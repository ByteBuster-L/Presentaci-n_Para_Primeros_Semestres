
let logo = document.querySelector('.logo');
gsap.from(logo, {
    duration: 1.2,
    opacity: 0,
    y: 300,
    ease: "power2.out"
});

gsap.from('.menu-icon', {
    duration: 1,
    opacity: 0,
    x: -300,
    ease: "power2.out"
});

gsap.registerPlugin(ScrollTrigger);

// Animar el contenedor principal del footer
gsap.from(".footer-content", {
    scrollTrigger: {
        trigger: ".footer-content",
        start: "top 85%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 80,
    duration: 1.2,
    ease: "power2.out"
});

// Animar las columnas internas del footer en cascada
gsap.from(".footer-main, .links", {
    scrollTrigger: {
        trigger: ".footer-content",
        start: "top 90%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 60,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out"
});

// Animar el escudo y los enlaces sociales
gsap.from(".escudo, .social-links a", {
    scrollTrigger: {
        trigger: ".footer-content",
        start: "top 95%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    scale: 0.7,
    duration: 0.7,
    stagger: 0.1,
    ease: "back.out(1.7)"
});

// Animación de entrada para cada letra del saludo, en cascada y con rebote
gsap.from(".greetings span", {
    opacity: 0,
    y: -200, // Caen desde arriba
    scale: 1.5,
    rotate: gsap.utils.wrap([-30, 30]),
    stagger: 0.08,
    duration: 1.2,
    ease: "bounce.out",
    onComplete: () => {
        document.querySelectorAll('.greetings span').forEach(span => {
            span.classList.add('glow');
        });
    }
});

// Animación para la descripción, con fade y subida
gsap.from(".description", {
    opacity: 0,
    y: 60,
    duration: 1,
    delay: 1,
    ease: "power3.out"
});

// Animación para el botón, con rebote y escala
gsap.from(".button", {
    opacity: 0,
    scale: 0.5,
    y: 90,
    duration: 1,
    delay: 1.5,
    ease: "elastic.out(1, 0.6)"
});

// Efecto hover animado para el botón (opcional, solo visual)
gsap.utils.toArray(".botones a").forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        gsap.to(btn, { scale: 1.08, backgroundColor: "#39c6d6", color: "#111", duration: 0.3 });
    });
    btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { scale: 1, backgroundColor: "#0a2be9", color: "#fff", duration: 0.3 });
    });
});