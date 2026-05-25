const form = document.getElementById('pricing-form');
const modalInput = document.getElementById('modal');
const profitInput = document.getElementById('profit');
const categorySelect = document.getElementById('category');
const ongkirCheckbox = document.getElementById('ongkir-xtra');
const outputDisplay = document.getElementById('hasil');

// Custom category elements
const customCategoryGroup = document.getElementById('custom-category-group');
const customCategoryInput = document.getElementById('custom-category');
const customFeeInput = document.getElementById('custom-fee');

const ADMIN_FEES = {
    'aksesoris': 0.09,
    'fashion-bayi': 0.09,
    'fashion-muslim': 0.10,
    'jam-tangan': 0.09,
    'koper-tas': 0.10
};

// Show/hide custom category input
categorySelect.addEventListener('change', () => {
    if (categorySelect.value === 'custom') {
        customCategoryGroup.style.display = 'block';
        customCategoryInput.required = true;
        customFeeInput.required = true;
    } else {
        customCategoryGroup.style.display = 'none';
        customCategoryInput.required = false;
        customFeeInput.required = false;
        customCategoryInput.value = '';
        customFeeInput.value = '';
    }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const modal = Number(modalInput.value);
  const profit = Number(profitInput.value);
  const category = categorySelect.value;

  // Validasi awal
  if (!modal || !profit || !category) {
    outputDisplay.textContent = "Tolong diisi semua fieldnya";
    return;
  }

  // Hitung fee (handle custom category)
  let adminFee;
  let categoryName;

  if (category === 'custom') {
    // Custom category
    categoryName = customCategoryInput.value || 'Kategori Custom';
    const customFee = Number(customFeeInput.value);
    
    if (!customFee || customFee < 0 || customFee > 100) {
        outputDisplay.textContent = "Biaya admin tidak valid (0-100%)!";
        return;
    }
    
    adminFee = customFee / 100;
  } else {
    // Predefined category
    if (!(category in ADMIN_FEES)) {
        outputDisplay.textContent = "Kategori tidak valid!";
        return;
    }
    
    adminFee = ADMIN_FEES[category];
    categoryName = categorySelect.options[categorySelect.selectedIndex].text.split('(')[0].trim();
  }

  // Validasi modal harus > 0
  if (modal <= 0) {
    outputDisplay.textContent = "Modal harus lebih dari 0!";
    return;
  }

  // Validasi profit tidak boleh negatif 
  if (profit < 0) {
    outputDisplay.textContent = "Profit tidak boleh negatif!";
    return;
  }
  
  const totalFee = adminFee + (ongkirCheckbox.checked ? 0.045 : 0);
  
  if (totalFee >= 1) {
     outputDisplay.textContent = "Total biaya tidak boleh ≥ 100%!";
     return;
  }
  
  const hargaJual = (modal + profit) / (1 - totalFee);

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });

  outputDisplay.innerHTML = `
    <strong>Harga Jual: ${formatter.format(hargaJual)}</strong><br>
    <small>Kategori: ${categoryName} | Total Fee: ${(totalFee * 100).toFixed(2)}%</small>
  `;
});

form.addEventListener('reset', () => {
     outputDisplay.textContent = '';
     categorySelect.value = '';
     customCategoryGroup.style.display = 'none';
     customCategoryInput.value = '';
     customFeeInput.value = '';
});

// No bubble dialog
['modal', 'profit', 'category', 'custom-category', 'custom-fee'].forEach(id => {
    document.getElementById(id).addEventListener('invalid', (e) => {
        e.preventDefault();
    });
});