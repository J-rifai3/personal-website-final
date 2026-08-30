(function () {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let width, height, particles, lines;
  let mouse = { x: null, y: null };
  let animationId;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    const count = prefersReducedMotion ? 30 : Math.min(90, Math.floor((width * height) / 12000));
    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawBackground() {
    const gradient = ctx.createRadialGradient(
      width * 0.5, height * 0.3, 0,
      width * 0.5, height * 0.5, width * 0.8
    );
    gradient.addColorStop(0, "#0c1428");
    gradient.addColorStop(0.5, "#070b14");
    gradient.addColorStop(1, "#050810");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawSwirl() {
    const time = Date.now() * 0.00015;
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = "#5eead4";

    for (let s = 0; s < 3; s++) {
      ctx.beginPath();
      const cx = width * (0.3 + s * 0.2);
      const cy = height * (0.4 + s * 0.1);
      const maxR = 180 + s * 60;

      for (let a = 0; a <= Math.PI * 4; a += 0.08) {
        const r = (a / (Math.PI * 4)) * maxR;
        const x = cx + Math.cos(a + time + s) * r;
        const y = cy + Math.sin(a + time * 1.3 + s) * r;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawParticles() {
    const connectDist = prefersReducedMotion ? 0 : 140;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (!prefersReducedMotion) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            p.x -= dx * 0.008;
            p.y -= dy * 0.008;
          }
        }
      }

      const pulseAlpha = p.alpha + Math.sin(Date.now() * 0.002 + p.pulse) * 0.08;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(94, 234, 212, ${Math.max(0.05, pulseAlpha)})`;
      ctx.fill();

      if (connectDist > 0) {
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(94, 234, 212, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }
  }

  function drawBubbles() {
    const time = Date.now() * 0.001;
    ctx.save();

    for (let i = 0; i < 5; i++) {
      const bx = width * (0.1 + i * 0.18) + Math.sin(time * 0.3 + i * 2) * 30;
      const by = height * (0.2 + (i % 3) * 0.25) + Math.cos(time * 0.25 + i) * 40;
      const br = 60 + i * 25;

      const bubble = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bubble.addColorStop(0, "rgba(45, 212, 191, 0.03)");
      bubble.addColorStop(0.7, "rgba(45, 212, 191, 0.01)");
      bubble.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle = bubble;
      ctx.fill();
    }

    ctx.restore();
  }

  function animate() {
    drawBackground();
    if (!prefersReducedMotion) {
      drawSwirl();
      drawBubbles();
    }
    drawParticles();
    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  animate();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();
