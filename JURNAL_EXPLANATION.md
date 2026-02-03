# 📓 PENJELASAN JURNAL UMUM

## 🎯 Apa itu Jurnal Umum?

Jurnal Umum adalah catatan akuntansi standar yang mencatat semua transaksi keuangan menggunakan sistem **double-entry bookkeeping** (pembukuan berpasangan). Setiap transaksi akan memiliki **Debit** dan **Kredit** yang jumlahnya **selalu sama**.

---

## 💰 JURNAL UNTUK TRANSAKSI PENJUALAN

Ketika Anda membuat transaksi **Penjualan**, sistem akan **OTOMATIS** membuat jurnal:

### Contoh Penjualan:
**Transaksi**: Menjual barang ke PT Maju Jaya senilai Rp 5.000.000

**Jurnal yang dibuat otomatis:**

| Tanggal | Keterangan | Akun | Debit | Kredit |
|---------|------------|------|-------|--------|
| 02-02-2026 | Penjualan SL20260202XXXX | **Kas** | Rp 5.000.000 | - |
| 02-02-2026 | Penjualan SL20260202XXXX | **Penjualan** | - | Rp 5.000.000 |
| | | **TOTAL** | **Rp 5.000.000** | **Rp 5.000.000** |

### Penjelasan:
- ✅ **Debit Kas** = Uang masuk ke kas perusahaan
- ✅ **Kredit Penjualan** = Pendapatan dari penjualan

> **Prinsip**: Kas bertambah (Debit), Pendapatan bertambah (Kredit)

---

## 🛒 JURNAL UNTUK TRANSAKSI PEMBELIAN

Ketika Anda membuat transaksi **Pembelian**, sistem akan **OTOMATIS** membuat jurnal:

### Contoh Pembelian:
**Transaksi**: Membeli barang dari CV Parts Center senilai Rp 3.000.000

**Jurnal yang dibuat otomatis:**

| Tanggal | Keterangan | Akun | Debit | Kredit |
|---------|------------|------|-------|--------|
| 02-02-2026 | Pembelian PO20260202XXXX | **Persediaan** | Rp 3.000.000 | - |
| 02-02-2026 | Pembelian PO20260202XXXX | **Kas** | - | Rp 3.000.000 |
| | | **TOTAL** | **Rp 3.000.000** | **Rp 3.000.000** |

### Penjelasan:
- ✅ **Debit Persediaan** = Barang masuk ke persediaan
- ✅ **Kredit Kas** = Uang keluar dari kas perusahaan

> **Prinsip**: Persediaan bertambah (Debit), Kas berkurang (Kredit)

---

## 📊 AKUN-AKUN YANG DIGUNAKAN

### 1. **Kas** (Asset)
- Uang tunai perusahaan
- **Bertambah**: Debit
- **Berkurang**: Kredit

### 2. **Penjualan** (Revenue/Pendapatan)
- Hasil dari menjual barang
- **Bertambah**: Kredit
- **Berkurang**: Debit

### 3. **Persediaan** (Asset)
- Barang yang tersedia untuk dijual
- **Bertambah**: Debit
- **Berkurang**: Kredit

---

## 🔄 SIKLUS LENGKAP

### Contoh Bisnis Lengkap:

#### 1️⃣ Pembelian Barang
**Transaksi**: Beli laptop 10 unit @ Rp 7.000.000 = Rp 70.000.000

**Jurnal:**
- Debit: Persediaan Rp 70.000.000
- Kredit: Kas Rp 70.000.000

**Efek:**
- ✅ Stok laptop +10 unit
- ✅ Kas berkurang Rp 70.000.000
- ✅ Persediaan bertambah Rp 70.000.000

---

#### 2️⃣ Penjualan Barang
**Transaksi**: Jual 5 laptop @ Rp 8.500.000 = Rp 42.500.000

**Jurnal:**
- Debit: Kas Rp 42.500.000
- Kredit: Penjualan Rp 42.500.000

**Efek:**
- ✅ Stok laptop -5 unit
- ✅ Kas bertambah Rp 42.500.000
- ✅ Pendapatan bertambah Rp 42.500.000

---

#### 3️⃣ Hasil Akhir
**Posisi Kas:**
- Kas awal: Rp 100.000.000
- Pembelian: -Rp 70.000.000
- Penjualan: +Rp 42.500.000
- **Kas akhir: Rp 72.500.000**

**Posisi Stok:**
- Stok awal: 0 unit
- Pembelian: +10 unit
- Penjualan: -5 unit
- **Stok akhir: 5 unit laptop**

**Laba Kotor:**
- Pendapatan: Rp 42.500.000
- Harga Pokok: Rp 35.000.000 (5 x Rp 7.000.000)
- **Laba: Rp 7.500.000**

---

## ✅ KEUNTUNGAN SISTEM JURNAL OTOMATIS

### 1. **Akurat & Konsisten**
- Tidak ada kesalahan manual
- Sistem selalu balance (Debit = Kredit)

### 2. **Menghemat Waktu**
- Jurnal dibuat otomatis saat transaksi
- Tidak perlu input manual

### 3. **Audit Trail**
- Setiap jurnal punya `reference_type` dan `reference_id`
- Bisa dilacak ke transaksi aslinya

### 4. **Laporan Real-time**
- Jurnal langsung tersedia
- Bisa filter by tanggal
- Data selalu update

---

## 📋 CARA MENGGUNAKAN FITUR JURNAL

### 1. Lihat Semua Jurnal
1. Klik menu **"Jurnal Umum"**
2. Semua jurnal dari penjualan dan pembelian akan tampil
3. Urut dari yang terbaru

### 2. Filter by Tanggal
1. Pilih **"Dari Tanggal"** (contoh: 01-01-2026)
2. Pilih **"Sampai Tanggal"** (contoh: 31-01-2026)
3. Klik **"Filter"**
4. Jurnal hanya tampil dalam range tersebut

### 3. Memahami Data Jurnal
Kolom yang ditampilkan:
- **Tanggal**: Tanggal transaksi
- **Keterangan**: Deskripsi (contoh: "Penjualan SL20260202XXXX")
- **Akun**: Nama akun (Kas, Penjualan, Persediaan)
- **Debit**: Jumlah debit (jika ada)
- **Kredit**: Jumlah kredit (jika ada)

---

## 🔒 HAPUS TRANSAKSI = HAPUS JURNAL

### PENTING!
Ketika Anda menghapus transaksi penjualan atau pembelian:

✅ **Yang terjadi otomatis:**
1. Transaksi dihapus
2. Item transaksi dihapus
3. **Jurnal terkait dihapus**
4. **Stok dikembalikan** (untuk penjualan) atau **dikurangi** (untuk pembelian)

Contoh:
- Hapus penjualan 5 laptop → stok +5 laptop (dikembalikan)
- Hapus pembelian 10 laptop → stok -10 laptop (dikurangi)

---

## 📚 ISTILAH AKUNTANSI

| Istilah | Penjelasan |
|---------|------------|
| **Debit** | Sisi kiri dalam jurnal, untuk akun Asset bertambah |
| **Kredit** | Sisi kanan dalam jurnal, untuk akun Revenue bertambah |
| **Double-Entry** | Sistem pembukuan di mana setiap transaksi punya 2 sisi (Debit & Kredit) yang sama |
| **Balance** | Keseimbangan, total Debit harus = total Kredit |
| **Asset** | Harta perusahaan (Kas, Persediaan, dll) |
| **Revenue** | Pendapatan (Penjualan) |
| **Expense** | Beban/Biaya (belum diimplementasi) |

---

## 🎓 CONTOH KASUS LENGKAP

### Skenario: Toko Elektronik

#### Hari 1: Beli Barang
**Transaksi**: Beli 20 mouse wireless @ Rp 75.000 dari Supplier A

**Efek:**
- Stok mouse: +20 unit
- Kas: -Rp 1.500.000

**Jurnal:**
```
Debit: Persediaan Rp 1.500.000
Kredit: Kas Rp 1.500.000
```

---

#### Hari 2: Jual Barang (Transaksi 1)
**Transaksi**: Jual 10 mouse @ Rp 150.000 ke Pelanggan A

**Efek:**
- Stok mouse: -10 unit (sisa 10)
- Kas: +Rp 1.500.000
- Pendapatan: +Rp 1.500.000

**Jurnal:**
```
Debit: Kas Rp 1.500.000
Kredit: Penjualan Rp 1.500.000
```

---

#### Hari 3: Jual Barang (Transaksi 2)
**Transaksi**: Jual 8 mouse @ Rp 150.000 ke Pelanggan B

**Efek:**
- Stok mouse: -8 unit (sisa 2)
- Kas: +Rp 1.200.000
- Pendapatan: +Rp 1.200.000

**Jurnal:**
```
Debit: Kas Rp 1.200.000
Kredit: Penjualan Rp 1.200.000
```

---

#### Laporan Akhir:

**Posisi Kas:**
- Awal: Rp 10.000.000
- Pembelian: -Rp 1.500.000
- Penjualan 1: +Rp 1.500.000
- Penjualan 2: +Rp 1.200.000
- **Akhir: Rp 11.200.000**

**Posisi Stok:**
- Beli: +20 unit
- Jual: -18 unit
- **Sisa: 2 unit mouse**

**Analisis Laba:**
- **Pendapatan Total**: Rp 2.700.000
- **Harga Pokok**: Rp 1.350.000 (18 x Rp 75.000)
- **Laba Kotor**: Rp 1.350.000
- **Margin**: 50%

---

## 🚀 FITUR LANJUTAN (Bisa Dikembangkan)

Saat ini sistem sudah mencatat:
- ✅ Kas
- ✅ Penjualan
- ✅ Persediaan

**Bisa ditambahkan:**
- 📊 Neraca (Balance Sheet)
- 📊 Laba Rugi (Income Statement)
- 📊 Harga Pokok Penjualan (COGS)
- 📊 Beban Operasional
- 📊 Hutang & Piutang
- 📊 Modal & Ekuitas

---

## 💡 TIPS MENGGUNAKAN JURNAL

### ✅ DO (Lakukan):
1. Selalu cek jurnal setelah transaksi
2. Pastikan Debit = Kredit
3. Filter by tanggal untuk periode tertentu
4. Export untuk backup (bisa ditambahkan fitur CSV)

### ❌ DON'T (Jangan):
1. Jangan edit jurnal manual (gunakan UI)
2. Jangan hapus jurnal langsung dari database
3. Selalu hapus via menu Penjualan/Pembelian

---

## 📞 BANTUAN

Jika ada pertanyaan tentang jurnal:
1. Baca penjelasan di atas
2. Coba buat transaksi test
3. Lihat jurnal yang terbentuk
4. Bandingkan dengan contoh di sini

---

**Semoga membantu! 📚✨**
