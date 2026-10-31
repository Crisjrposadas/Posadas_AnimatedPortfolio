const projects = {
  fieldnotes: {
    title: "Fieldnotes — a slower web",
    role: "Concept · Design & front-end",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85",
    alt: "Notebook and laptop on a warm wooden desk",
    description: "An editorial home for noticing the everyday. Fieldnotes explores how generous type, calm pacing, and small interactions can make a reading experience feel more human. I shaped the visual direction and built a responsive prototype with lightweight JavaScript.",
    tags: ["HTML / CSS", "JavaScript", "UI DESIGN"]
  },
  orbit: {
    title: "Orbit — rituals for focus",
    role: "Product concept · UX research & design",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85",
    alt: "Dreamlike deep blue night sky",
    description: "A gentle focus companion that treats attention as something to care for, not optimize. The concept pairs short reflection prompts with a quiet visual timer. I mapped the core flow, explored the interaction model, and prototyped the key screens in Figma.",
    tags: ["FIGMA", "PROTOTYPING", "RESEARCH"]
  },
  afterimage: {
    title: "Afterimage — color in motion",
    role: "Visual study · 3D & art direction",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85",
    alt: "Colorful paint palette and creative studio materials",
    description: "A playful study of color, material, and movement across a series of digital still lifes. This self-initiated exploration combines simple 3D forms with tactile textures, looking for the sweet spot between precision and happy accidents.",
    tags: ["BLENDER", "PHOTOSHOP", "ART DIRECTION"]
  }
};
const modal = document.querySelector("#project-modal");
const toast = document.querySelector("#toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}
document.querySelectorAll(".project-open").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projects[button.dataset.project];
    document.querySelector("#modal-title").textContent = project.title;
    document.querySelector("#modal-role").textContent = project.role;
    document.querySelector("#modal-description").textContent = project.description;
    const image = document.querySelector("#modal-image");
    image.src = project.image;
    image.alt = project.alt;
    const tags = document.querySelector("#modal-tags");
    tags.replaceChildren(...project.tags.map((label) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = label;
      return tag;
    }));
    modal.showModal();
  });
});
document.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => { if (event.target === modal) modal.close(); });
document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    let count = 0;
    document.querySelectorAll(".project-card").forEach((card) => {
      const visible = button.dataset.filter === "all" || card.dataset.category.split(" ").includes(button.dataset.filter);
      card.hidden = !visible;
      if (visible) count++;
    });
    document.querySelector("#project-count").textContent = `${String(count).padStart(2, "0")} PROJECT${count === 1 ? "" : "S"}`;
  });
});
document.querySelectorAll(".skill-filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".skill-filter").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    document.querySelectorAll(".skill").forEach((skill) => {
      skill.hidden = button.dataset.skillFilter !== "all" && skill.dataset.skillCategory !== button.dataset.skillFilter;
    });
  });
});
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  menuToggle.querySelector("span").textContent = open ? "×" : "☰";
  navLinks.classList.toggle("open", open);
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  menuToggle.querySelector("span").textContent = "☰";
}));
document.querySelector(".back-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#copy-email").addEventListener("click", async (event) => {
  const email = event.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email address copied to clipboard.");
  } catch {
    window.location.href = `mailto:${email}`;
    showToast("Opening your email app.");
  }
});
const fields = [
  { input: document.querySelector("#name"), error: document.querySelector("#name-error"), validate: (value) => value.trim().length >= 2 ? "" : "Please enter at least 2 characters." },
  { input: document.querySelector("#email"), error: document.querySelector("#email-error"), validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Enter a valid email address." },
  { input: document.querySelector("#message"), error: document.querySelector("#message-error"), validate: (value) => value.trim().length >= 10 ? "" : "Please add a little more detail (10 characters minimum)." }
];
function validateField(field) {
  const error = field.validate(field.input.value);
  field.error.textContent = error;
  field.input.setAttribute("aria-invalid", String(Boolean(error)));
  return !error;
}
fields.forEach((field) => {
  field.input.addEventListener("blur", () => validateField(field));
  field.input.addEventListener("input", () => {
    if (field.input.hasAttribute("aria-invalid")) validateField(field);
  });
});
document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    fields.find((field) => field.input.getAttribute("aria-invalid") === "true")?.input.focus();
    showToast("Please check the highlighted fields.");
    return;
  }
  const [name, email, message] = fields.map((field) => field.input.value.trim());
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${email}`);
  showToast("Your email app is opening with your message.");
  window.location.href = `mailto:crisaldo.posadas@example.com?subject=${subject}&body=${body}`;
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
const roles = ["Creative Developer", "UI / UX Designer", "Digital Storyteller", "IT Professional in the making"];
const typedRole = document.querySelector("#typed-role");
let roleIndex = 0;
let characterIndex = roles[0].length;
let deleting = true;
function typeRole() {
  const role = roles[roleIndex];
  characterIndex += deleting ? -1 : 1;
  typedRole.textContent = role.slice(0, characterIndex);
  if (characterIndex <= 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  } else if (characterIndex >= roles[roleIndex].length) {
    deleting = true;
    setTimeout(typeRole, 1650);
    return;
  }
  setTimeout(typeRole, deleting ? 48 : 78);
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setTimeout(typeRole, 1900);
document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .08}px, ${(event.clientY - rect.top - rect.height / 2) * .12 - 2}px)`;
  });
  button.addEventListener("pointerleave", () => { button.style.transform = ""; });
});

const scrollProgress = document.querySelector("#scroll-progress");
let scrollUpdatePending = false;
function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress.style.setProperty("--scroll-progress", Math.min(progress, 1));
  scrollUpdatePending = false;
}
window.addEventListener("scroll", () => {
  if (!scrollUpdatePending) {
    window.requestAnimationFrame(updateScrollProgress);
    scrollUpdatePending = true;
  }
}, { passive: true });
updateScrollProgress();

const pointerMotionAllowed = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
if (pointerMotionAllowed) {
  const heroVisual = document.querySelector(".hero-visual");
  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    heroVisual.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 9}deg) rotateY(${(x - 0.5) * 11}deg)`;
    heroVisual.style.setProperty("--pointer-x", `${x * 100}%`);
    heroVisual.style.setProperty("--pointer-y", `${y * 100}%`);
  });
  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.transform = "";
    heroVisual.style.setProperty("--pointer-x", "50%");
    heroVisual.style.setProperty("--pointer-y", "45%");
  });

  document.querySelectorAll(".project-card").forEach((card) => {
    const image = card.querySelector(".project-image");
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
      card.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
      image.style.setProperty("--pointer-x", `${x * 100}%`);
      image.style.setProperty("--pointer-y", `${y * 100}%`);
      card.classList.add("is-tilting");
    });
    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}
