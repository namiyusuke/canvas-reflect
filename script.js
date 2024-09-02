const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const texts = ["pacage", "包装箱", "紙", "branding", "logo"];
const fontSize = ["40", "20", "30", "40", "50"];
const particles = [];
const lines = []; // Array to store line particles

// Array of possible line colors
const lineColors = ["rgba(97, 101, 211, 1)", "rgba(203, 203, 203, 1)"];
// Function to create a new lightning line particle
function createLightningLine() {
  const side = Math.floor(Math.random() * 4);
  let x, y, dx, dy;

  switch (side) {
    // case 0: // Top
    //   x = Math.random() * canvas.width;
    //   y = 0;
    //   dx = 0;
    //   dy = Math.random() * 5 + 2; // Downwards
    //   break;
    // case 1: // Bottom
    //   x = Math.random() * canvas.width;
    //   y = canvas.height;
    //   dx = 0;
    //   dy = -(Math.random() * 3 + 2); // Upwards
    //   break;
    case 2: // Left
      x = 0;
      y = Math.random() * canvas.height;
      dx = Math.random() * 10 + 2; // Rightwards
      dy = 0;
      break;
    case 3: // Right
      x = canvas.width;
      y = Math.random() * canvas.height;
      dx = -(Math.random() * 10 + 2); // Leftwards
      dy = 0;
      break;
  }
  // Randomly select a color for the line
  const color = lineColors[Math.floor(Math.random() * lineColors.length)];
  // Create a lightning line object with initial properties
  lines.push({
    x: x,
    y: y,
    dx: dx,
    dy: dy,
    segments: [{ x: x, y: y }], // Start with the initial point
    growing: true,
    age: 0,
    maxAge: 150, // Maximum age before it starts disappearing
    color: color, // Assign the randomly selected color
  });
}

// Function to create the next segment in a lightning path
function createNextLightningSegment(line) {
  if (!line.growing) return; // If not growing, do not add more segments

  const lastSegment = line.segments[line.segments.length - 1];
  const angle = Math.atan2(line.dy, line.dx) + ((Math.random() - 0.5) * Math.PI) / 3; // Random change in angle
  const segmentLength = Math.random() * 120 + 10; // Random segment length
  const nextX = lastSegment.x + Math.cos(angle) * segmentLength;
  const nextY = lastSegment.y + Math.sin(angle) * segmentLength;

  line.segments.push({ x: nextX, y: nextY });

  // Check if the line has reached its maximum length
  if (line.segments.length > 10) {
    // Example condition to stop growing
    line.growing = false;
  }
}

// Resize the canvas to fit the window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  particles.forEach((particle) => {
    particle.x = Math.random() * canvas.width;
    particle.y = Math.random() * canvas.height;
  });
}

// Initial canvas size setup
resizeCanvas();
for (let i = 0; i < texts.length; i++) {
  particles.push({
    text: texts[i],
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: Math.random() * 5 - 2,
    dy: Math.random() * 6 - 5,
    angle: Math.random() * 2 * Math.PI,
    rotationSpeed: Math.random() * 0.1 - 0.1,
    fontSize: fontSize[i],
  });
}

// Draw text on canvas
function drawText(particle) {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.angle);
  ctx.font = `${particle.fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(particle.text, 0, 0);
  ctx.restore();
}

// Draw lightning lines on canvas
function drawLines() {
  lines.forEach((line) => {
    ctx.strokeStyle = line.color; // Use the line's specific color
    ctx.lineWidth = 12;
    ctx.beginPath();
    if (line.segments.length > 0) {
      ctx.moveTo(line.segments[0].x, line.segments[0].y);
      for (let i = 1; i < line.segments.length; i++) {
        ctx.lineTo(line.segments[i].x, line.segments[i].y);
      }
    }
    ctx.stroke();
  });
}
// Function to detect collision between a text particle and a line
function detectCollision(particle, line) {
  const px = particle.x;
  const py = particle.y;

  for (let i = 0; i < line.segments.length - 1; i++) {
    const lx1 = line.segments[i].x;
    const ly1 = line.segments[i].y;
    const lx2 = line.segments[i + 1].x;
    const ly2 = line.segments[i + 1].y;

    const lineLengthSquared = (lx2 - lx1) ** 2 + (ly2 - ly1) ** 2;
    if (lineLengthSquared === 0) continue; // Line of zero length

    let t = ((px - lx1) * (lx2 - lx1) + (py - ly1) * (ly2 - ly1)) / lineLengthSquared;
    t = Math.max(0, Math.min(1, t));
    const closestX = lx1 + t * (lx2 - lx1);
    const closestY = ly1 + t * (ly2 - ly1);

    const distance = Math.hypot(px - closestX, py - closestY);

    if (distance < particle.fontSize / 2) {
      return true; // Collision detected
    }
  }

  return false;
}

// Function to reflect a particle off a line
function reflectParticle(particle, line) {
  // Simplified reflection logic for lightning line
  particle.dx = -particle.dx;
  particle.dy = -particle.dy;
}

// Animate canvas
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let particle of particles) {
    particle.x += particle.dx;
    particle.y += particle.dy;
    particle.angle += particle.rotationSpeed;

    if (particle.x <= 0 || particle.x >= canvas.width) {
      particle.dx = -particle.dx;
    }
    if (particle.y <= 0 || particle.y >= canvas.height) {
      particle.dy = -particle.dy;
    }

    // Check for collisions with each line
    for (let line of lines) {
      if (detectCollision(particle, line)) {
        reflectParticle(particle, line);
      }
    }

    drawText(particle);
  }

  // Update and draw lines
  lines.forEach((line, index) => {
    if (line.growing) {
      createNextLightningSegment(line); // Add the next segment to the line if it's still growing
    } else {
      line.age++; // Increase the age of the line once it's done growing
      if (line.age > line.maxAge) {
        lines.splice(index, 1); // Remove line if it's too old
      }
    }
  });

  drawLines();

  requestAnimationFrame(animate);
}

// Handle canvas clicks
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  const padding = 50;

  for (let particle of particles) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.angle);
    const textWidth = ctx.measureText(particle.text).width;
    const textHeight = 30;
    ctx.restore();

    if (
      clickX >= particle.x - textWidth / 2 - padding &&
      clickX <= particle.x + textWidth / 2 + padding &&
      clickY >= particle.y - textHeight / 2 - padding &&
      clickY <= particle.y + textHeight / 2 + padding
    ) {
      particle.dx = Math.random() * 6 - 3;
      particle.dy = Math.random() * 6 - 3;
      particle.rotationSpeed = Math.random() * 0.2 - 0.1;
    }
  }
});

// Add new lightning lines periodically
setInterval(createLightningLine, 1000);

// Resize canvas on window resize
window.addEventListener("resize", resizeCanvas);

// Start animation
animate();
