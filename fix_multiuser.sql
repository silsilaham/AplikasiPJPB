-- Migration to support Multi-User Data
-- This script changes the schema to use user_id instead of id=1

-- List of all tables
DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'dataPenjualan', 'dataPembelian', 'dataTransaksiKas',
        'dataPembayaranPiutang', 'dataPembayaranHutang', 'dataJurnal',
        'dataMasterCustomer', 'dataMasterSupplier', 'dataMasterBarang',
        'dataPiutangAwal', 'dataHutangAwal', 'dataKasHarian',
        'kategoriKas', 'kategoriKasMasuk', 'kategoriKasKeluar'
    ];
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        -- 1. Drop old primary key if it exists
        EXECUTE format('ALTER TABLE IF EXISTS public.%I DROP CONSTRAINT IF EXISTS %I_pkey', t, t);
        
        -- 2. Add user_id column if not exists
        EXECUTE format('ALTER TABLE IF EXISTS public.%I ADD COLUMN IF NOT EXISTS user_id uuid', t);
        
        -- 3. If "id" column exists and we want to migrate data (optional, but safer to just start clean or migrate)
        -- For now, let's just make user_id the Primary Key
        -- (If tables were empty or we don't mind resetting, we can just drop/recreate)
    END LOOP;
END $$;

-- Specifically recreate tables with user_id as PK for better multi-user support
-- We use uuid to match auth.uid()
DROP TABLE IF EXISTS public."dataPenjualan";
CREATE TABLE public."dataPenjualan" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataPembelian";
CREATE TABLE public."dataPembelian" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataTransaksiKas";
CREATE TABLE public."dataTransaksiKas" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataPembayaranPiutang";
CREATE TABLE public."dataPembayaranPiutang" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataPembayaranHutang";
CREATE TABLE public."dataPembayaranHutang" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataJurnal";
CREATE TABLE public."dataJurnal" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataMasterCustomer";
CREATE TABLE public."dataMasterCustomer" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataMasterSupplier";
CREATE TABLE public."dataMasterSupplier" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataMasterBarang";
CREATE TABLE public."dataMasterBarang" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataPiutangAwal";
CREATE TABLE public."dataPiutangAwal" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataHutangAwal";
CREATE TABLE public."dataHutangAwal" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."dataKasHarian";
CREATE TABLE public."dataKasHarian" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."kategoriKas";
CREATE TABLE public."kategoriKas" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."kategoriKasMasuk";
CREATE TABLE public."kategoriKasMasuk" (user_id uuid PRIMARY KEY, content jsonb);

DROP TABLE IF EXISTS public."kategoriKasKeluar";
CREATE TABLE public."kategoriKasKeluar" (user_id uuid PRIMARY KEY, content jsonb);

-- Enable RLS and add Policies
DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'dataPenjualan', 'dataPembelian', 'dataTransaksiKas',
        'dataPembayaranPiutang', 'dataPembayaranHutang', 'dataJurnal',
        'dataMasterCustomer', 'dataMasterSupplier', 'dataMasterBarang',
        'dataPiutangAwal', 'dataHutangAwal', 'dataKasHarian',
        'kategoriKas', 'kategoriKasMasuk', 'kategoriKasKeluar'
    ];
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "Users can only access their own data" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Users can only access their own data" ON public.%I FOR ALL USING (auth.uid() = user_id)', t);
    END LOOP;
END $$;
