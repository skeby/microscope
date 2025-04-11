const apiUrl = 'https://microscope-0jah.onrender.com/api'

document.getElementById('form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const microscopeSize = parseFloat(document.getElementById('microscopeSize').value);
  const magnification = parseFloat(document.getElementById('magnification').value);
  const originalSize = microscopeSize / magnification;

  document.getElementById('originalSize').value = originalSize.toFixed(2);

  const payload = { username, microscopeSize, magnification, originalSize };

  try {
    const res = await fetch(`${apiUrl}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchAndDisplayConversions();
      alert('Submission saved!');
    } else {
      alert('Submission failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
});

async function fetchAndDisplayConversions() {
  const res = await fetch(`${apiUrl}/conversions`);
  const data = await res.json();

  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';

  data.forEach(entry => {
    const date = new Date(entry.createdAt || entry.submittedAt).toLocaleString();
  
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="padding: 10px; border: 1px solid #ccc;">${entry.username}</td>
      <td style="padding: 10px; border: 1px solid #ccc;">${entry.microscopeSize}</td>
      <td style="padding: 10px; border: 1px solid #ccc;">${entry.magnification}</td>
      <td style="padding: 10px; border: 1px solid #ccc;">${entry.originalSize.toFixed(2)}</td>
      <td style="padding: 10px; border: 1px solid #ccc;">${date}</td>
    `;
    tableBody.appendChild(row);
  });
  
}

window.onload = fetchAndDisplayConversions;
