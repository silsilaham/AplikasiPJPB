-- SQL Script for Supabase Setup
-- PT. SUMBER GANDA MEKAR Application

-- 1. Create tables for JSON-based storage
CREATE TABLE IF NOT EXISTS public."dataPenjualan" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataPembelian" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataTransaksiKas" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataPembayaranPiutang" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataPembayaranHutang" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataJurnal" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataMasterCustomer" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataMasterSupplier" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataMasterBarang" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataPiutangAwal" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataHutangAwal" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."dataKasHarian" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."kategoriKas" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."kategoriKasMasuk" (id int8 PRIMARY KEY, content jsonb);
CREATE TABLE IF NOT EXISTS public."kategoriKasKeluar" (id int8 PRIMARY KEY, content jsonb);

-- 2. Disable Row Level Security (RLS) for testing
-- In production, you should enable RLS and set proper policies
ALTER TABLE public."dataPenjualan" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataPembelian" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataTransaksiKas" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataPembayaranPiutang" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataPembayaranHutang" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataJurnal" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataMasterCustomer" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataMasterSupplier" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataMasterBarang" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataPiutangAwal" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataHutangAwal" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."dataKasHarian" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."kategoriKas" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."kategoriKasMasuk" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."kategoriKasKeluar" DISABLE ROW LEVEL SECURITY;

-- 3. (Optional) Initialize first row for tables that need it
-- INSERT INTO public."dataPenjualan" (id, content) VALUES (1, '[]'::jsonb) ON CONFLICT DO NOTHING;
-- ... repeat for other tables if necessary
