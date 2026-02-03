# 📊 Aplikasi Penjualan & Pembelian dengan Jurnal Umum

Aplikasi manajemen penjualan, pembelian, dan jurnal umum berbasis web dengan fitur multi-user menggunakan Supabase sebagai database.

## ✨ Fitur Utama

### 🔐 Multi-User Authentication
- Login & Register dengan email/password
- Session management otomatis
- Data terpisah per user (Row Level Security)

### 📦 Master Data
- **Produk**: Kelola produk dengan kode, nama, harga beli, harga jual, dan stok
- **Pelanggan**: Kelola data pelanggan dengan kode, nama, alamat, dan telepon
- **Supplier**: Kelola data supplier dengan kode, nama, alamat, dan telepon

### 💰 Transaksi
- **Penjualan**: Catat transaksi penjualan dengan multiple items
- **Pembelian**: Catat transaksi pembelian dengan multiple items
- Stock otomatis terupdate setelah transaksi
- Invoice number otomatis

### 📓 Jurnal Umum
- Jurnal otomatis dibuat dari setiap transaksi penjualan dan pembelian
- Filter by date range
- Format double-entry bookkeeping:
  - **Penjualan**: Debit Kas, Kredit Penjualan
  - **Pembelian**: Debit Persediaan, Kredit Kas

### 📊 Laporan
- Laporan Penjualan dengan filter tanggal
- Laporan Pembelian dengan filter tanggal
- Total otomatis dihitung
- Export data ready (bisa ditambahkan CSV export)

### 🎨 Desain Modern
- Dark theme yang elegant
- Responsive design
- Smooth animations & transitions
- Modern color palette dengan gradients
- Professional UI/UX

## 🚀 Cara Setup

### 1. Setup Supabase

1. **Buat Akun Supabase**
   - Kunjungi [supabase.com](https://supabase.com)
   - Sign up atau login
   - Buat project baru

2. **Buat Database**
   - Di Supabase Dashboard, buka **SQL Editor**
   - Copy seluruh isi file `database.sql`
   - Paste dan **Run** SQL tersebut
   - Tunggu hingga semua tabel berhasil dibuat

3. **Dapatkan API Credentials**
   - Buka **Settings** → **API**
   - Copy **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - Copy **anon/public key**

### 2. Konfigurasi Aplikasi

1. **Edit file `app.js`**
   - Buka file `app.js`
   - Cari baris 4-5:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
   - Ganti dengan credentials Supabase Anda:
   ```javascript
   const SUPABASE_URL = 'https://xxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

### 3. Jalankan Aplikasi

Ada beberapa cara untuk menjalankan aplikasi:

#### Cara 1: Dengan Live Server (Recommended)
1. Install VS Code extension **Live Server**
2. Klik kanan pada `index.html`
3. Pilih **Open with Live Server**
4. Browser akan otomatis terbuka

#### Cara 2: Dengan Python
```bash
# Python 3
python -m http.server 8000

# Atau Python 2
python -m SimpleHTTPServer 8000
```
Lalu buka browser ke `http://localhost:8000`

#### Cara 3: Dengan Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server

# Atau dengan npx (tanpa install)
npx http-server
```

#### Cara 4: Deploy ke Hosting
Upload ketiga file (`index.html`, `app.js`, `database.sql`) ke hosting web Anda seperti:
- Netlify (drag & drop, gratis)
- Vercel (gratis)
- GitHub Pages (gratis)
- Hosting lainnya

## 📖 Cara Menggunakan

### 1. Register User Baru
1. Buka aplikasi
2. Klik tab **Register**
3. Masukkan email dan password (min 6 karakter)
4. Klik **Daftar**
5. Setelah berhasil, pindah ke tab **Login**

### 2. Login
1. Masukkan email dan password
2. Klik **Login**
3. Aplikasi akan otomatis menampilkan dashboard

### 3. Tambah Master Data

#### Tambah Produk:
1. Klik menu **Produk**
2. Klik **+ Tambah Produk**
3. Isi: Kode, Nama, Harga Beli, Harga Jual, Stok
4. Klik **Simpan**

#### Tambah Pelanggan:
1. Klik menu **Pelanggan**
2. Klik **+ Tambah Pelanggan**
3. Isi data pelanggan
4. Klik **Simpan**

#### Tambah Supplier:
1. Klik menu **Supplier**
2. Klik **+ Tambah Supplier**
3. Isi data supplier
4. Klik **Simpan**

### 4. Transaksi Penjualan
1. Klik menu **Penjualan**
2. Klik **+ Transaksi Baru**
3. Pilih tanggal dan pelanggan
4. Klik **+ Tambah Item** untuk menambah produk
5. Pilih produk, isi jumlah (harga akan otomatis terisi)
6. Bisa tambah item lagi jika perlu
7. Total akan otomatis terhitung
8. Klik **Simpan**

**Yang terjadi otomatis:**
- Stok produk berkurang
- Jurnal dibuat (Debit Kas, Kredit Penjualan)

### 5. Transaksi Pembelian
1. Klik menu **Pembelian**
2. Klik **+ Transaksi Baru**
3. Pilih tanggal dan supplier
4. Tambah item pembelian
5. Klik **Simpan**

**Yang terjadi otomatis:**
- Stok produk bertambah
- Jurnal dibuat (Debit Persediaan, Kredit Kas)

### 6. Lihat Jurnal Umum
1. Klik menu **Jurnal Umum**
2. Semua jurnal dari transaksi akan tampil
3. Bisa filter by tanggal dengan:
   - Pilih "Dari Tanggal"
   - Pilih "Sampai Tanggal"
   - Klik **Filter**

### 7. Generate Laporan
1. Klik menu **Laporan**
2. **Laporan Penjualan:**
   - Pilih range tanggal
   - Klik **Generate**
   - Akan muncul daftar penjualan + total
3. **Laporan Pembelian:**
   - Pilih range tanggal
   - Klik **Generate**
   - Akan muncul daftar pembelian + total

## 🗃️ Struktur Database

### Tables:
1. **products** - Master produk
2. **customers** - Master pelanggan
3. **suppliers** - Master supplier
4. **sales** - Header transaksi penjualan
5. **sale_items** - Detail item penjualan
6. **purchases** - Header transaksi pembelian
7. **purchase_items** - Detail item pembelian
8. **journals** - Jurnal umum

### Row Level Security (RLS):
Setiap tabel dilindungi dengan RLS sehingga:
- User hanya bisa melihat data miliknya sendiri
- User tidak bisa mengakses data user lain
- Multi-user safe

## 🎨 Teknologi yang Digunakan

- **Frontend:**
  - HTML5
  - CSS3 (Modern Dark Theme)
  - Vanilla JavaScript (ES6+)
  - Google Fonts (Inter)

- **Backend:**
  - Supabase (PostgreSQL)
  - Supabase Auth (Authentication)
  - Row Level Security (Multi-user)

- **Design:**
  - Responsive Design
  - Dark Mode
  - Glassmorphism effects
  - Smooth animations
  - Modern color palette

## 📝 Fitur yang Bisa Ditambahkan

1. **Export to Excel/CSV**
   - Export laporan penjualan
   - Export laporan pembelian
   - Export jurnal umum

2. **Print Invoice**
   - Print nota penjualan
   - Print nota pembelian

3. **Dashboard Charts**
   - Grafik penjualan per bulan
   - Grafik pembelian per bulan
   - Top 10 produk terlaris

4. **Advanced Reports**
   - Laporan laba rugi
   - Laporan stok produk
   - Laporan piutang pelanggan

5. **Edit Transaksi**
   - Edit penjualan yang sudah ada
   - Edit pembelian yang sudah ada

6. **Payment Methods**
   - Tunai
   - Transfer
   - Status pembayaran (Lunas/Belum)

7. **User Profile**
   - Edit profile
   - Change password
   - Upload avatar

## 🔧 Troubleshooting

### Error: "Invalid API key"
- Pastikan SUPABASE_URL dan SUPABASE_ANON_KEY sudah benar
- Cek apakah sudah mengganti 'YOUR_SUPABASE_URL' di app.js

### Error: "Failed to fetch"
- Pastikan sudah menjalankan database.sql di Supabase
- Periksa koneksi internet
- Cek console browser (F12) untuk detail error

### Data tidak muncul
- Pastikan sudah login
- Pastikan RLS sudah enabled di Supabase
- Cek apakah ada error di console browser

### Tidak bisa register
- Pastikan email valid
- Password minimal 6 karakter
- Cek di Supabase Authentication apakah user ter-create

## 📄 File Structure

```
BEBAS DATA/
├── index.html      # Main HTML file (UI)
├── app.js          # JavaScript logic
├── database.sql    # Database schema
└── README.md       # Dokumentasi ini
```

## 🙏 Credits

Dibuat dengan ❤️ menggunakan:
- [Supabase](https://supabase.com) - Backend as a Service
- [Google Fonts](https://fonts.google.com) - Typography
- Modern Web Standards

## 📞 Support

Jika ada pertanyaan atau issue:
1. Cek dokumentasi ini terlebih dahulu
2. Cek console browser (F12) untuk error details
3. Pastikan semua langkah setup sudah benar

---

**Selamat menggunakan! 🚀**
