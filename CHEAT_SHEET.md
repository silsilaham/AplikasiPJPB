# ⚡ CHEAT SHEET - Panduan Cepat

## 🔑 LANGKAH CEPAT MULAI

```bash
1. Setup Supabase → Baca SETUP_GUIDE.md
2. Edit app.js → Ganti SUPABASE_URL & SUPABASE_ANON_KEY
3. Jalankan → python -m http.server 8000
4. Buka → http://localhost:8000
```

---

## 📋 STRUKTUR FILE

| File | Fungsi |
|------|--------|
| **index.html** | UI utama aplikasi |
| **app.js** | Logic & koneksi database (⚠️ EDIT DI SINI) |
| **database.sql** | Schema database untuk Supabase |
| **README.md** | Dokumentasi lengkap |
| **SETUP_GUIDE.md** | Panduan setup step-by-step |
| **JURNAL_EXPLANATION.md** | Penjelasan sistem jurnal |
| **helper.js** | Testing tools & sample data |
| **CHEAT_SHEET.md** | File ini |

---

## 🎯 CARA EDIT KONFIGURASI

### File: `app.js` (Baris 4-5)

**SEBELUM:**
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

**SESUDAH:**
```javascript
const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

💡 **Dapatkan credentials dari**: Supabase Dashboard → Settings → API

---

## 🚀 CARA JALANKAN APLIKASI

### Option 1: Live Server (Recommended)
```
1. Install VS Code
2. Install extension "Live Server"
3. Klik kanan index.html
4. "Open with Live Server"
```

### Option 2: Python
```bash
cd "d:\LatihanFoxpro\BEBAS DATA"
python -m http.server 8000
# Buka: http://localhost:8000
```

### Option 3: Node.js
```bash
npx http-server
# Buka: http://localhost:8080
```

---

## 🗄️ SETUP DATABASE SUPABASE

### SQL Editor → Paste & Run:

**File**: `database.sql`

**Tables yang dibuat:**
1. ✅ products
2. ✅ customers
3. ✅ suppliers
4. ✅ sales
5. ✅ sale_items
6. ✅ purchases
7. ✅ purchase_items
8. ✅ journals

---

## 📊 MENU & FITUR

| Menu | Fungsi |
|------|--------|
| 📈 **Dashboard** | Overview & statistik |
| 📦 **Produk** | CRUD produk + stok |
| 👥 **Pelanggan** | CRUD data pelanggan |
| 🏢 **Supplier** | CRUD data supplier |
| 💰 **Penjualan** | Transaksi penjualan + multiple items |
| 🛒 **Pembelian** | Transaksi pembelian + multiple items |
| 📓 **Jurnal Umum** | Lihat jurnal otomatis (Debit/Kredit) |
| 📊 **Laporan** | Generate laporan by date range |

---

## 🔄 FLOW TRANSAKSI

### Penjualan:
```
1. Klik "Penjualan" → "+ Transaksi Baru"
2. Pilih tanggal & pelanggan
3. Tambah item (produk, qty, harga)
4. Simpan
→ Stok berkurang ✅
→ Jurnal dibuat (Debit Kas, Kredit Penjualan) ✅
```

### Pembelian:
```
1. Klik "Pembelian" → "+ Transaksi Baru"
2. Pilih tanggal & supplier
3. Tambah item (produk, qty, harga)
4. Simpan
→ Stok bertambah ✅
→ Jurnal dibuat (Debit Persediaan, Kredit Kas) ✅
```

---

## 📓 JURNAL OTOMATIS

### Penjualan = 2 Jurnal Entries
```
Debit: Kas         [+] Uang masuk
Kredit: Penjualan  [+] Pendapatan
```

### Pembelian = 2 Jurnal Entries
```
Debit: Persediaan  [+] Barang masuk
Kredit: Kas        [-] Uang keluar
```

---

## 🛠️ TESTING & DEBUGGING

### Browser Console (F12):

**Test Connection:**
```javascript
testSupabaseConnection()
```

**Insert Sample Data:**
```javascript
insertSampleData()
// ⚠️ Harus login dulu!
```

**Check Current User:**
```javascript
console.log(currentUser)
```

**Check Data:**
```javascript
console.log(products)
console.log(customers)
console.log(sales)
```

---

## 🐛 TROUBLESHOOTING CEPAT

| Error | Solusi |
|-------|--------|
| **Invalid API key** | Cek app.js baris 4-5, pastikan sudah ganti |
| **Failed to fetch** | Cek koneksi internet, pastikan SQL sudah di-run |
| **Data tidak muncul** | F12 → Console, cek error. Pastikan RLS enabled |
| **Tidak bisa register** | Email valid, password min 6 char |
| **Table doesn't exist** | Run database.sql di Supabase SQL Editor |

---

## 🎨 CUSTOMIZATION

### Ganti Warna Tema:

**File**: `index.html` (dalam tag `<style>`)

```css
:root {
    --primary: hsl(230, 70%, 55%);      /* Biru utama */
    --secondary: hsl(280, 65%, 60%);    /* Ungu */
    --success: hsl(152, 69%, 45%);      /* Hijau */
    --danger: hsl(0, 84%, 60%);         /* Merah */
}
```

### Ganti Nama Aplikasi:

**File**: `index.html`

```html
<!-- Baris ~31 -->
<h1>📊 Aplikasi Penjualan</h1>

<!-- Baris ~251 (sidebar) -->
<div class="app-logo">📊 Sales Pro</div>
```

---

## 💾 BACKUP DATA

### Export dari Supabase:

1. Supabase Dashboard → Table Editor
2. Pilih table (contoh: `products`)
3. Klik **Export** → CSV
4. Simpan file

### Manual Backup:

```sql
-- Jalankan di SQL Editor untuk export
SELECT * FROM products;
SELECT * FROM customers;
SELECT * FROM sales;
-- Copy hasilnya
```

---

## 📱 DEPLOY ONLINE

### Netlify (Termudah):
```
1. https://app.netlify.com
2. Drag & drop folder
3. Done!
```

### Vercel:
```
1. https://vercel.com
2. Import repository atau drag & drop
3. Deploy
```

### GitHub Pages:
```
1. Push ke GitHub
2. Settings → Pages
3. Enable GitHub Pages
```

---

## 🔐 KEAMANAN

### ✅ Sudah Aman:
- Row Level Security (RLS) di Supabase
- Data terpisah per user
- Password hashing by Supabase Auth
- API key server-side validation

### ⚠️ Jangan:
- Share SUPABASE_ANON_KEY di public
- Commit credentials ke GitHub
- Kasih akses database langsung ke user

---

## 📊 SAMPLE DATA (Testing)

### Quick Insert via Console:

**Login dulu**, lalu F12 → Console:

```javascript
// Copy dari helper.js
insertSampleData()

// Akan insert:
// - 5 produk
// - 5 pelanggan
// - 5 supplier
```

---

## 🎓 BELAJAR LEBIH LANJUT

| Topik | File |
|-------|------|
| Setup lengkap | `SETUP_GUIDE.md` |
| Dokumentasi penuh | `README.md` |
| Penjelasan jurnal | `JURNAL_EXPLANATION.md` |
| SQL schema | `database.sql` |

---

## 🆘 BANTUAN CEPAT

### Cek Console Browser (F12):

```javascript
// Lihat error
console.error()

// Cek state aplikasi
console.log('User:', currentUser)
console.log('Products:', products)
console.log('Customers:', customers)

// Test Supabase
supabase.from('products').select('*').then(console.log)
```

---

## 📞 SUPPORT

1. ✅ Baca file dokumentasi
2. ✅ Cek console browser (F12)
3. ✅ Verify Supabase credentials
4. ✅ Pastikan database.sql sudah di-run

---

## ⚡ SHORTCUT KEYBOARD

| Key | Fungsi |
|-----|--------|
| **F12** | Buka Developer Tools |
| **Ctrl+Shift+I** | Buka DevTools |
| **Ctrl+R** | Refresh |
| **Ctrl+Shift+R** | Hard refresh (clear cache) |
| **Ctrl+S** | Save file |

---

## ✅ CHECKLIST SETUP

```
☐ 1. Buat akun Supabase
☐ 2. Buat project Supabase
☐ 3. Run database.sql di SQL Editor
☐ 4. Copy SUPABASE_URL
☐ 5. Copy SUPABASE_ANON_KEY
☐ 6. Edit app.js baris 4-5
☐ 7. Save app.js
☐ 8. Jalankan server (python/live server)
☐ 9. Buka browser
☐ 10. Register user baru
☐ 11. Login
☐ 12. Test fitur
```

---

## 🎉 SELESAI!

**Aplikasi siap digunakan!**

Mulai dengan:
1. Tambah produk
2. Tambah pelanggan/supplier
3. Buat transaksi
4. Lihat jurnal otomatis
5. Generate laporan

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Made with**: HTML, CSS, JavaScript, Supabase
