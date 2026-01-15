document.addEventListener("DOMContentLoaded", () => {

  const container = document.querySelector(".container");
  if (container) {
    container.style.opacity = 0;
    container.style.transform = "translateY(20px)";
    setTimeout(() => {
      container.style.transition = "opacity 1s ease, transform 1s ease";
      container.style.opacity = 1;
      container.style.transform = "translateY(0)";
    }, 100);
  }

  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "scale(1.1)";
      link.style.transition = "transform 0.2s ease";
    });
    link.addEventListener("mouseleave", () => {
      link.style.transform = "scale(1)";
    });
  });

  const nav = document.querySelector("nav");
  if (nav) {
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "🌙";
    toggleBtn.style.border = "none";
    toggleBtn.style.background = "transparent";
    toggleBtn.style.color = "#f1f1f1";
    toggleBtn.style.fontSize = "1.2rem";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.marginLeft = "20px";
    toggleBtn.onclick = () => {
      document.body.classList.toggle("light-mode");
      toggleBtn.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
    };
    nav.appendChild(toggleBtn);
  }

  const canvas = document.createElement("canvas");
  canvas.id = "particle-canvas";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const numParticles = 80;
  const particles = [];
  const mouse = { x: null, y: null };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = 3;
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      if (mouse.x && mouse.y) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < 100) {
          this.x += dx / distance;
          this.y += dy / distance;
        }
      }
    }
    draw() {
      ctx.fillStyle = "#00537D";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.closePath();
      ctx.fill();
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.strokeStyle = "rgba(0,83,125,0.2)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  for (let i=0; i<numParticles; i++) {
    particles.push(new Particle());
  }
  animateParticles();

  let audio = window.audioPlayer;
  if (!audio) {
    audio = document.createElement("audio");
    audio.src = "song.mp3";
    audio.loop = true;
    audio.volume = 0.5;
    document.body.appendChild(audio);
    window.audioPlayer = audio;
  }

  if (!document.getElementById("audio-control")) {
    const audioBtn = document.createElement("button");
    audioBtn.id = "audio-control";
    audioBtn.textContent = "▶️";
    document.body.appendChild(audioBtn);

    const savedTime = localStorage.getItem("musicTime");
    const savedState = localStorage.getItem("musicPlaying");

    if (savedTime) audio.currentTime = parseFloat(savedTime);
    if (savedState === "true") audio.play().then(() => { audioBtn.textContent = "⏸️"; }).catch(() => {});

    audioBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play(); audioBtn.textContent = "⏸️"; localStorage.setItem("musicPlaying", true);
      } else {
        audio.pause(); audioBtn.textContent = "▶️"; localStorage.setItem("musicPlaying", false);
      }
    });

    document.addEventListener("click", () => {
      if (audio.paused && localStorage.getItem("musicPlaying") !== "false") {
        audio.play().then(() => { audioBtn.textContent = "⏸️"; localStorage.setItem("musicPlaying", true); });
      }
    }, { once: true });
  }

  setInterval(() => {
    if (audio) {
      localStorage.setItem("musicTime", audio.currentTime);
      localStorage.setItem("musicPlaying", !audio.paused);
    }
  }, 1000);


  const welcomeHeading = document.getElementById("welcome-heading");
  if (welcomeHeading) {
    const headingText = "Welcome to DxrkModding!";
    let headingIndex = 0;
    function typeWriterHeading() {
      if (headingIndex < headingText.length) {
        welcomeHeading.innerHTML += headingText.charAt(headingIndex);
        headingIndex++;
        setTimeout(typeWriterHeading, 100);
      }
    }
    setTimeout(typeWriterHeading, 500);
  }

  const welcomeText = document.getElementById("welcome-text");
  if (welcomeText) {
    const welcomeMessage = `Welcome to DxrkModding! 🎉

We’re a passionate team of modders who love creating, experimenting, and Modding the fuck out of servers in fivem. Whether you’re here to discover our talented team members, Watch Our videos and make sure to purchase cheats!, or learn some of the ways we use the cheats!, you’ll find plenty of exciting stuff to explore.

And if you want to stay up-to-date, chat with us directly, or just hang out with other like-minded people, make sure to join our Discord server — it's where all the Apks and discussions happen!

Thanks for stopping by, and much love from all of us here at Ligma Services. ❤️`;

    let index = 0;
    function typeWriter() {
      if (index < welcomeMessage.length) {
        welcomeText.innerHTML += welcomeMessage.charAt(index);
        index++;
        setTimeout(typeWriter, 15);
      }
    }
    setTimeout(typeWriter, 1500);
  }

  const showBtn = document.getElementById("show-method-btn");
  const methodContent = document.getElementById("method-content");

  if (showBtn && methodContent) {
    showBtn.addEventListener("click", () => {
      if (methodContent.style.display === "block") {
        methodContent.style.display = "none";
        showBtn.textContent = "Read Method";
        return;
      }

      methodContent.style.display = "block";
      methodContent.innerHTML = "Loading...";

      fetch("https://raw.githubusercontent.com/dxrkalfie/Modding-Methods/main/Modding%20Methods/Basic/How%20to%20Get%20Photon%20%26%20Playfab%20Infomation.md")
        .then(response => response.text())
        .then(data => {
          methodContent.innerHTML = marked.parse(data); 
          showBtn.textContent = "Hide Method";
        })
        .catch(err => {
          methodContent.textContent = "Failed to load method: " + err;
        });
    });
  }

  const showBtn2 = document.getElementById("show-method-btn2");
  const methodContent2 = document.getElementById("method-content2");

  if (showBtn2 && methodContent2) {
    showBtn2.addEventListener("click", () => {
      if (methodContent2.style.display === "block") {
        methodContent2.style.display = "none";
        showBtn2.textContent = "Read Method";
        return;
      }

      methodContent2.style.display = "block";
      methodContent2.innerHTML = "Loading...";

      fetch("https://raw.githubusercontent.com/dxrkalfie/Modding-Methods/main/Modding%20Methods/Basic/How%20to%20Mod.md")
        .then(response => response.text())
        .then(data => {
          methodContent2.innerHTML = marked.parse(data); 
          showBtn2.textContent = "Hide Method";
        })
        .catch(err => {
          methodContent2.textContent = "Failed to load method: " + err;
        });
    });
  }

});




