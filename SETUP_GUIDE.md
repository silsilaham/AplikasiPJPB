# 🚀 PANDUAN SETUP CEPAT

## ⚡ 3 Langkah Mudah untuk Memulai

### 📋 Yang Anda Butuhkan:
- ✅ Akun Supabase (gratis)
- ✅ Browser modern (Chrome, Firefox, Edge)
- ✅ Text editor (VS Code, Notepad++, dll)

---

## 🎯 LANGKAH 1: SETUP SUPABASE (5 menit)

### 1.1 Buat Akun & Project
1. Buka https://supabase.com
2. Klik **"Start your project"** atau **"Sign Up"**
3. Login dengan GitHub/Google
4. Klik **"New Project"**
5. Isi:
   - **Name**: `sales-app` (atau nama lain)
   - **Database Password**: [buat password, simpan baik-baik]
   - **Region**: Southeast Asia (Singapore) - pilih yang terdekat
6. Klik **"Create new project"**
7. Tunggu 2-3 menit hingga project selesai dibuat

### 1.2 Buat Database
1. Di dashboard Supabase, cari menu **SQL Editor** (ikon ⚡ di sidebar kiri)
2. Klik **SQL Editor**
3. Buka file `database.sql` yang sudah saya buatkan
4. **Copy SEMUA isinya** (Ctrl+A, Ctrl+C)
5. Kembali ke Supabase SQL Editor
6. **Paste** di area editor (Ctrl+V)
7. Klik tombol **"Run"** (atau tekan Ctrl+Enter)
8. Tunggu sampai muncul "Success. No rows returned"
9. ✅ **Database siap!**

### 1.3 Dapatkan API Keys
1. Di Supabase dashboard, klik ⚙️ **"Settings"** (pojok kiri bawah)
2. Klik **"API"** di menu Settings
3. Anda akan melihat:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API keys** → **anon/public**: `eyJhbGciOiJIUz...`
4. **COPY kedua value ini**, kita akan pakai di langkah berikutnya

---

## 🎯 LANGKAH 2: KONFIGURASI APLIKASI (2 menit)

### 2.1 Edit File app.js
1. Buka file `app.js` dengan text editor
2. Cari baris 4-5 (paling atas):
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

3. **Ganti** dengan credentials Supabase Anda:
   ```javascript
   const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXB...';
   ```

4. **Save** file (Ctrl+S)
5. ✅ **Konfigurasi selesai!**

---

## 🎯 LANGKAH 3: JALANKAN APLIKASI (1 menit)

### Pilih salah satu cara:

#### 🟢 CARA 1: Live Server (Paling Mudah - Recommended!)
1. Install VS Code (jika belum punya)
2. Install extension **"Live Server"**
   - Buka VS Code
   - Klik Extensions (Ctrl+Shift+X)
   - Cari "Live Server"
   - Install yang by Ritwick Dey
3. Klik kanan pada `index.html`
4. Pilih **"Open with Live Server"**
5. ✅ Browser otomatis terbuka!

#### 🟢 CARA 2: Python (Jika Sudah Install Python)
1. Buka Command Prompt / Terminal
2. Masuk ke folder aplikasi:
   ```bash
   cd "d:\LatihanFoxpro\BEBAS DATA"
   ```
3. Jalankan server:
   ```bash
   python -m http.server 8000
   ```
4. Buka browser, ketik: `http://localhost:8000`
5. ✅ Aplikasi terbuka!

#### 🟢 CARA 3: Double Click (Paling Simpel tapi Terbatas)
1. Double click file `index.html`
2. ✅ Langsung buka di browser!
   
   ⚠️ **Catatan**: Cara ini mungkin ada error CORS untuk beberapa fitur

#### 🟢 CARA 4: Deploy Online (Agar Bisa Diakses dari Mana Saja)

**Option A: Netlify (Paling Mudah)**
1. Buka https://app.netlify.com
2. Login dengan GitHub/Email
3. Drag & drop folder aplikasi ke Netlify
4. ✅ Dapat URL online gratis!

**Option B: Vercel**
1. Buka https://vercel.com
2. Login dengan GitHub
3. Import project atau drag & drop
4. ✅ Deploy otomatis!

---

## 🎉 SELESAI! Sekarang Anda Bisa:

### ✅ Register User Baru
1. Buka aplikasi
2. Klik tab **"Register"**
3. Masukkan email & password (min 6 karakter)
4. Klik **"Daftar"**

### ✅ Login
1. Klik tab **"Login"**
2. Masukkan email & password yang tadi didaftarkan
3. Klik **"Login"**

### ✅ Mulai Menggunakan
Setelah login, Anda akan melihat:
- 📈 **Dashboard** - Overview transaksi
- 📦 **Produk** - Tambah/edit produk
- 👥 **Pelanggan** - Data pelanggan
- 🏢 **Supplier** - Data supplier
- 💰 **Penjualan** - Catat penjualan
- 🛒 **Pembelian** - Catat pembelian
- 📓 **Jurnal Umum** - Lihat jurnal otomatis
- 📊 **Laporan** - Generate laporan

---

## 🆘 TROUBLESHOOTING

### ❌ Error: "Invalid API key"
**Solusi:**
1. Cek apakah sudah mengganti `YOUR_SUPABASE_URL` di `app.js`
2. Pastikan tidak ada spasi atau karakter tambahan
3. Pastikan quote (`'`) tidak terhapus

### ❌ Error: "Failed to fetch" atau "Network error"
**Solusi:**
1. Pastikan koneksi internet aktif
2. Cek apakah sudah run `database.sql` di Supabase
3. Periksa apakah Project URL benar

### ❌ Data tidak muncul setelah login
**Solusi:**
1. Buka Console Browser (F12)
2. Lihat tab "Console" untuk error
3. Pastikan RLS (Row Level Security) sudah enabled di Supabase

### ❌ Tidak bisa register
**Solusi:**
1. Pastikan email format valid (contoh@email.com)
2. Password minimal 6 karakter
3. Cek Supabase → Authentication → Users untuk melihat apakah user tercreate

### ❌ Server Python tidak berjalan
**Solusi:**
1. Pastikan Python sudah terinstall: `python --version`
2. Jika belum, install dari https://python.org
3. Atau gunakan cara Live Server

---

## 💡 TIPS & TRICKS

### 🔥 Insert Data Sample untuk Testing
1. Buka aplikasi dan login
2. Tekan F12 (buka Console)
3. Copy-paste dari file `helper.js`
4. Ketik: `insertSampleData()`
5. Enter
6. ✅ Data sample otomatis masuk!

### 🔥 Cek Koneksi Supabase
1. Tekan F12
2. Copy script dari `helper.js`
3. Ketik: `testSupabaseConnection()`
4. Akan muncul status koneksi

### 🔥 Shortcut Keyboard
- **F12** - Buka Developer Console
- **Ctrl+Shift+I** - Buka DevTools
- **Ctrl+R** - Refresh halaman
- **Ctrl+Shift+R** - Hard refresh (clear cache)

---

## 📞 BUTUH BANTUAN?

1. ✅ Baca **README.md** untuk dokumentasi lengkap
2. ✅ Cek **database.sql** untuk struktur database
3. ✅ Gunakan **helper.js** untuk testing
4. ✅ Cek Console Browser (F12) untuk error details

---

## 🎊 SELAMAT!

Aplikasi Anda sudah siap digunakan! 

Mulai dengan:
1. Tambah beberapa produk
2. Tambah pelanggan/supplier
3. Buat transaksi penjualan/pembelian
4. Lihat jurnal otomatis terbentuk
5. Generate laporan

**Selamat mencoba! 🚀**

---

## 📚 File-file dalam Project:

| File | Deskripsi |
|------|-----------|
| `index.html` | File utama HTML (UI aplikasi) |
| `app.js` | Logic JavaScript (⚠️ Edit config di sini) |
| `database.sql` | Schema database untuk Supabase |
| `README.md` | Dokumentasi lengkap |
| `SETUP_GUIDE.md` | Panduan ini |
| `helper.js` | Tool testing & sample data |

---

**Last Updated**: February 2026
**Version**: 1.0.0
