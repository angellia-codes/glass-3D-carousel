let xPos = 0;
let autoRotate;

const card = [
  {title: "What is HTML?", desc: "HTML (HyperText Markup Language) is used to create the basic structure and content of a webpage."},
  {title: "How HTML Works", desc: "HTML uses tags to tell the browser what each piece of content represents."},
  {title: "What is CSS?", desc: "CSS (Cascading Style Sheets) is used to control the appearance and layout of a webpage."},
  {title: "How CSS Works", desc: "CSS can change colors, fonts, spacing, sizes, positioning, and animations."},
  {title: "What is JavaScript?", desc: "JavaScript is a programming language that adds interactivity and behavior to webpages."},
  {title: "How JavaScript Works", desc: "JavaScript can respond to user actions such as clicks, typing, scrolling, and form submissions."},
  {title: "HTML vs CSS", desc: "HTML builds the content and structure, while CSS makes that content look good."},
  {title: "CSS vs JavaScript", desc: "CSS controls visual presentation, while JavaScript controls dynamic behavior."},
  {title: "How They Work Together", desc: "HTML creates the structure, CSS designs it, and JavaScript makes it interactive."},
  {title: "The Big Picture", desc: "Think of HTML as the skeleton, CSS as the appearance, and JavaScript as the brain of a webpage."}
];

function buildCards() {
  const ring = document.querySelector(".ring");
  
  card.forEach((cardData) => {
    const card = document.createElement("div");
    card.className = "img";

    const number = document.createElement("div");
    number.className = "num";
    number.textContent = cardData.title;

    const description = document.createElement("div");
    description.className = "desc";
    description.textContent = cardData.desc;

    card.appendChild(number);
    card.appendChild(description);
    ring.appendChild(card);
  });
}

function stopAutoRotate() {
  if (autoRotate) {
    autoRotate.kill();
    autoRotate = null;
  }
}

function startAutoRotate() {
  stopAutoRotate();
  autoRotate = gsap.to(".ring", {
    rotationY: "+=360",
    duration: 40,
    ease: "none",
    repeat: -1
  });
}

function dragStart(event) {
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  xPos = Math.round(clientX);

  gsap.set(".ring", {cursor: "grabbing"});
  stopAutoRotate();
  $(window).on("mousemove touchmove", drag);
}

function drag(event) {
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const currentX = Math.round(clientX);
  const movement = currentX - xPos;

  gsap.to(".ring", {
    rotationY: "-=" + movement,
    duration: 0.15,
    overwrite: true,
    ease: "power2.out"
  });

  xPos = currentX;
}

function dragEnd() {
  $(window).off("mousemove touchmove", drag);
  gsap.set(".ring", {cursor: "grab"});
  startAutoRotate();
}

function setupInteractions() {
  $(".img").on("mouseenter", function () {
    const current = this;

    gsap.to(".img", {
      opacity: function () {
        return this === current ? 1 : 0.5;
      },
      duration: 0.4,
      ease: "power3.out"
    });
  });

  $(".img").on("mouseleave", function () {
    gsap.to(".img", {
      opacity: 1,
      duration: 0.4,
      ease: "power2.inOut"
    });
  });

  $(window).on("mousedown touchstart", dragStart);
  $(window).on("mouseup touchend touchcancel", dragEnd);
}

buildCards();

gsap.timeline()
.set(".ring", {
  rotationY: 180,
  cursor: "grab"
})
.set(".img", {
  rotationY: (index) => index * -36,
  transformOrigin: "50% 50% 430px",
  z: -430,
  backfaceVisibility: "hidden",
  opacity: 1
})
.from(".img", {
  duration: 1.5,
  y: 200,
  opacity: 0,
  stagger: 0.1,
  ease: "expo"
})
.add(() => {
  setupInteractions();
  startAutoRotate();
}, "-=0.5");