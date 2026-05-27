// ===== DOM SELECTION =====
const form = document.getElementById('pricing-form');
const modalInput = document.getElementById('modal');
const profitInput = document.getElementById('profit');
const totalFeeInput = document.getElementById('total-fee'); // ✅ Input fee baru
const outputDisplay = document.getElementById('hasil');

// ===== EVENT: SUBMIT =====
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // 1. Ambil & parse input
  const modal = Number(modalInput.value);
  const profit = Number(profitInput.value);
  const feePercent = Number(totalFeeInput.value);
  
  // 2. Validasi dasar
  if (!modal || !profit || feePercent === '') {
    outputDisplay.textContent = "Mohon lengkapi semua field!";
    return;
  }
  
  // 3. Validasi nilai masuk akal
  if (modal <= 0) {
    outputDisplay.textContent = "Modal angkanya harus > dari angka 0!";
    return;
  }
  if (profit < 0) {
    outputDisplay.textContent = "Profit tidak boleh negatif!";
    return;
  }
  if (feePercent < 0 || feePercent > 100) {
    outputDisplay.textContent = "Biaya admin dimulai dari 0-100%!";
    return;
  }
  
  // 4. Merubah persentase ke angka desimal
  const totalFee = feePercent / 100;
  
  // 5. Mencegah pembagian dengan angka nol
  if (totalFee >= 1) {
    outputDisplay.textContent = "Total biaya tidak boleh ≥ 100%!";
    return;
  }
  
  // 6. Rumus inti
  const hargaJual = (modal + profit) / (1 - totalFee);
  
  // 7. Format mata uang rupiah
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });
  
  // 8. Menampilkan hasil & breakdown
  const feeAmount = hargaJual * totalFee;
  const netAmount = hargaJual - feeAmount;
  
  outputDisplay.innerHTML = `
    <strong>Harga Jual: ${formatter.format(hargaJual)}</strong><br>
    <small>
      • Fee Shopee (${feePercent}%): ${formatter.format(feeAmount)}<br>
      • Diterima Bersih: ${formatter.format(netAmount)}<br>
      • Profit: ${formatter.format(profit)}
    </small>
  `;
});

// ===== EVENT: RESET =====
form.addEventListener('reset', () => {
  outputDisplay.textContent = '';
});

// ===== NO BUBBLE DIALOG =====
['modal', 'profit', 'total-fee'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('invalid', (e) => e.preventDefault());
  }
});