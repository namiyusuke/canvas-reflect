const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const texts = ["pacage", "包装箱", "紙", "branding", "logo"];
const particles = [];

for (let i = 0; i < texts.length; i++) {
  particles.push({
    text: texts[i],
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: Math.random() * 10 - 5,
    dy: Math.random() * 10 - 5,
    angle: Math.random() * 2 * Math.PI,
    rotationSpeed: Math.random() * 0.1 - 0.1,
  });
}

function drawText(particle) {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.angle);
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(particle.text, 0, 0);
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let particle of particles) {
    particle.x += particle.dx;
    particle.y += particle.dy;
    particle.angle += particle.rotationSpeed;

    // 壁に当たったら速度の方向を反転
    if (particle.x <= 0 || particle.x >= canvas.width) {
      particle.dx = -particle.dx;
    }
    if (particle.y <= 0 || particle.y >= canvas.height) {
      particle.dy = -particle.dy;
    }

    drawText(particle);
  }

  requestAnimationFrame(animate);
}

canvas.addEventListener("click", function () {
  for (let particle of particles) {
    particle.dx = Math.random() * 6 - 2; // -5から5までのランダムな速度
    particle.dy = Math.random() * 6 - 2; // -5から5までのランダムな速度
    particle.rotationSpeed = Math.random() * 0.2 - 0.1; // -0.1から0.1までのランダムな回転速度
  }
});

// 初期の描画とアニメーションの開始
animate();
