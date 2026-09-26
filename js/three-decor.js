/**
 * Subtle Geometric Canvas Decoration for Hero Background
 * Adds lightweight, elegant floating geometric educational shapes (cubes, tetrahedrons)
 * with low opacity and high performance.
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-decor-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;

  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  };

  window.addEventListener('resize', resize);
  resize();

  // Floating geometric particles
  const shapes = [];
  const shapeCount = 12;

  for (let i = 0; i < shapeCount; i++) {
    shapes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 15 + Math.random() * 25,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      type: i % 3, // 0: square, 1: triangle, 2: circle
      alpha: 0.08 + Math.random() * 0.12
    });
  }

  const render = () => {
    ctx.clearRect(0, 0, width, height);

    shapes.forEach(shape => {
      shape.x += shape.speedX;
      shape.y += shape.speedY;
      shape.rotation += shape.rotSpeed;

      // Wrap boundaries
      if (shape.x < -50) shape.x = width + 50;
      if (shape.x > width + 50) shape.x = -50;
      if (shape.y < -50) shape.y = height + 50;
      if (shape.y > height + 50) shape.y = -50;

      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.strokeStyle = `rgba(11, 78, 162, ${shape.alpha})`;
      ctx.lineWidth = 1.5;

      if (shape.type === 0) {
        // Wireframe Square / Cube face
        ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      } else if (shape.type === 1) {
        // Wireframe Triangle
        ctx.beginPath();
        ctx.moveTo(0, -shape.size / 2);
        ctx.lineTo(shape.size / 2, shape.size / 2);
        ctx.lineTo(-shape.size / 2, shape.size / 2);
        ctx.closePath();
        ctx.stroke();
      } else {
        // Geometric Circle ring
        ctx.beginPath();
        ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(render);
  };

  render();
});
