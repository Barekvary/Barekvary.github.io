function updateClock() {
  const now = new Date();
  document.getElementById('hour').textContent = String(now.getHours()).padStart(2, '0');
  document.getElementById('minute').textContent = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('second').textContent = String(now.getSeconds()).padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
});