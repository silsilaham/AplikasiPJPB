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

-- RLS Policies
CREATE POLICY "Users can view their own products" 
    ON products FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" 
    ON products FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
    ON products FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
    ON products FOR DELETE 
    USING (auth.uid() = user_id);

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

CREATE POLICY "Users can view their own customers" 
    ON customers FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customers" 
    ON customers FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers" 
    ON customers FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers" 
    ON customers FOR DELETE 
    USING (auth.uid() = user_id);

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

CREATE POLICY "Users can view their own suppliers" 
    ON suppliers FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suppliers" 
    ON suppliers FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers" 
    ON suppliers FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers" 
    ON suppliers FOR DELETE 
    USING (auth.uid() = user_id);

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

CREATE POLICY "Users can view their own sales" 
    ON sales FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sales" 
    ON sales FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales" 
    ON sales FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales" 
    ON sales FOR DELETE 
    USING (auth.uid() = user_id);

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

-- RLS for sale_items: Allow access if user owns the parent sale
CREATE POLICY "Users can view sale items of their own sales" 
    ON sale_items FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM sales 
            WHERE sales.id = sale_items.sale_id 
            AND sales.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert sale items for their own sales" 
    ON sale_items FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM sales 
            WHERE sales.id = sale_items.sale_id 
            AND sales.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update sale items of their own sales" 
    ON sale_items FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM sales 
            WHERE sales.id = sale_items.sale_id 
            AND sales.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete sale items of their own sales" 
    ON sale_items FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM sales 
            WHERE sales.id = sale_items.sale_id 
            AND sales.user_id = auth.uid()
        )
    );

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

CREATE POLICY "Users can view their own purchases" 
    ON purchases FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" 
    ON purchases FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchases" 
    ON purchases FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own purchases" 
    ON purchases FOR DELETE 
    USING (auth.uid() = user_id);

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

CREATE POLICY "Users can view purchase items of their own purchases" 
    ON purchase_items FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM purchases 
            WHERE purchases.id = purchase_items.purchase_id 
            AND purchases.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert purchase items for their own purchases" 
    ON purchase_items FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM purchases 
            WHERE purchases.id = purchase_items.purchase_id 
            AND purchases.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update purchase items of their own purchases" 
    ON purchase_items FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM purchases 
            WHERE purchases.id = purchase_items.purchase_id 
            AND purchases.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete purchase items of their own purchases" 
    ON purchase_items FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM purchases 
            WHERE purchases.id = purchase_items.purchase_id 
            AND purchases.user_id = auth.uid()
        )
    );

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

CREATE POLICY "Users can view their own journals" 
    ON journals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journals" 
    ON journals FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journals" 
    ON journals FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journals" 
    ON journals FOR DELETE 
    USING (auth.uid() = user_id);

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
