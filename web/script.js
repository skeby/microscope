document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const microscopeSize = parseFloat(document.getElementById('microscopeSize').value);
    const magnification = parseFloat(document.getElementById('magnification').value);
  
    if (!microscopeSize || !magnification || magnification === 0) {
      alert('Please enter valid values for microscope size and magnification.');
      return;
    }
  
    const realSize = microscopeSize / magnification;
    document.getElementById('originalSize').value = realSize.toFixed(2);
  });
  