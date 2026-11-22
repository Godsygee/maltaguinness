const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = document.getElementById("siteLoader");
window.setTimeout(() => loader?.classList.add("hidden"), 450);

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
    mainNav?.classList.remove("open");
    menuToggle?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open menu");
}

menuToggle?.addEventListener("click", () => {
    const open = mainNav?.classList.toggle("open") ?? false;
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const header = document.getElementById("header");
function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (!reducedMotion) {
    const particles = document.getElementById("heroParticles");
    if (particles) {
        for (let index = 0; index < 24; index += 1) {
            const particle = document.createElement("span");
            particle.className = "gold-particle";
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.setProperty("--particle-delay", `${Math.random() * -8}s`);
            particle.style.setProperty("--particle-duration", `${5 + Math.random() * 7}s`);
            particles.appendChild(particle);
        }
    }
}

if (window.gsap && !reducedMotion) {
    document.documentElement.classList.add("gsap-ready");
    gsap.timeline({ defaults: { ease: "power2.out" } })
        .from(".hero-copy > *", { y: 24, autoAlpha: 0, duration: 0.75, stagger: 0.1 })
        .fromTo(".hero-official-product", { scale: 0.94, autoAlpha: 0, rotationY: -8 }, {
            scale: 1,
            autoAlpha: 1,
            rotationY: 0,
            duration: 1.15,
        }, 0.1)
        .to(".hero-official-product", {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray(".reveal").forEach((element) => {
            gsap.fromTo(element, { autoAlpha: 0, y: 28 }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: { trigger: element, start: "top 88%", once: true },
            });
        });
        gsap.to(".hero-glow", {
            y: 100,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });
    }
} else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
let lastFocusedElement = null;

function closeLightbox() {
    if (!lightbox?.classList.contains("open")) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-active");
    lightboxImage?.removeAttribute("src");
    lastFocusedElement?.focus();
}

document.querySelectorAll("[data-lightbox]").forEach((button) => {
    button.addEventListener("click", () => {
        if (!lightbox || !lightboxImage || !lightboxCaption) return;
        lastFocusedElement = button;
        lightboxImage.src = button.dataset.lightbox;
        lightboxImage.alt = button.querySelector("img")?.alt ?? "";
        lightboxCaption.textContent = button.dataset.caption ?? "";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-active");
        lightboxClose?.focus();
    });
});
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeLightbox();
        closeMenu();
    }
});

document.querySelectorAll("[data-video-embed]").forEach((container) => {
    const playButton = container.querySelector("[data-video-id]");
    if (!playButton?.dataset.videoId) {
        console.error("Serving video embed is missing its YouTube video ID.");
        return;
    }

    playButton.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${playButton.dataset.videoId}?rel=0&autoplay=1`;
        iframe.title = playButton.getAttribute("aria-label") || "Malta Guinness serving video";
        iframe.loading = "eager";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allow = "autoplay; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        container.replaceChildren(iframe);
    });
});
