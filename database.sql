-- ============================================
-- SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this SQL in your Supabase SQL Editor to create all tables
-- Make sure you have enabled Row Level Security (RLS) for multi-user support

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    buy_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    sell_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Shared Access for Authenticated Users)
CREATE POLICY "Authenticated users can view all products" 
    ON products FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert products" 
    ON products FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" 
    ON products FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" 
    ON products FOR DELETE 
    USING (auth.role() = 'authenticated');

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(code);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all customers" 
    ON customers FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert customers" 
    ON customers FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update customers" 
    ON customers FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete customers" 
    ON customers FOR DELETE 
    USING (auth.role() = 'authenticated');

-- ============================================
-- SUPPLIERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(code);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all suppliers" 
    ON suppliers FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert suppliers" 
    ON suppliers FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update suppliers" 
    ON suppliers FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete suppliers" 
    ON suppliers FOR DELETE 
    USING (auth.role() = 'authenticated');

-- ============================================
-- SALES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    invoice_no VARCHAR(100) NOT NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_invoice_no ON sales(invoice_no);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all sales" 
    ON sales FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sales" 
    ON sales FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sales" 
    ON sales FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sales" 
    ON sales FOR DELETE 
    USING (auth.role() = 'authenticated');

-- ============================================
-- SALE ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sale_items (
    id BIGSERIAL PRIMARY KEY,
    sale_id BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    qty DECIMAL(10, 2) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);

ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- RLS for sale_items: Allow all authenticated users to manage items
CREATE POLICY "Authenticated users can view all sale items" 
    ON sale_items FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sale items" 
    ON sale_items FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sale items" 
    ON sale_items FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sale items" 
    ON sale_items FOR DELETE 
    USING (auth.role() = 'authenticated');

-- ============================================
-- PURCHASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS purchases (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    invoice_no VARCHAR(100) NOT NULL,
    supplier_id BIGINT NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(date);
CREATE INDEX IF NOT EXISTS idx_purchases_invoice_no ON purchases(invoice_no);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all purchases" 
    ON purchases FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert purchases" 
    ON purchases FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update purchases" 
    ON purchases FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete purchases" 
    ON purchases FOR DELETE 
    USING (auth.role() = 'authenticated');

-- ============================================
-- PURCHASE ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_items (
    id BIGSERIAL PRIMARY KEY,
    purchase_id BIGINT NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    qty DECIMAL(10, 2) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id ON purchase_items(purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_product_id ON purchase_items(product_id);

ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all purchase items" 
    ON purchase_items FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert purchase items" 
    ON purchase_items FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update purchase items" 
    ON purchase_items FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete purchase items" 
    ON purchase_items FOR DELETE 
    USING (auth.role() = 'authenticated');

-- ============================================
-- JOURNALS TABLE (General Journal)
-- ============================================
CREATE TABLE IF NOT EXISTS journals (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    account VARCHAR(100) NOT NULL,
    debit DECIMAL(15, 2) NOT NULL DEFAULT 0,
    credit DECIMAL(15, 2) NOT NULL DEFAULT 0,
    reference_type VARCHAR(50), -- 'sale' or 'purchase'
    reference_id BIGINT, -- ID of sale or purchase
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journals_user_id ON journals(user_id);
CREATE INDEX IF NOT EXISTS idx_journals_date ON journals(date);
CREATE INDEX IF NOT EXISTS idx_journals_reference ON journals(reference_type, reference_id);

ALTER TABLE journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all journals" 
    ON journals FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert journals" 
    ON journals FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update journals" 
    ON journals FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete journals" 
    ON journals FOR DELETE 
    USING (auth.role() = 'authenticated');

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at 
    BEFORE UPDATE ON sales 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at 
    BEFORE UPDATE ON purchases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
