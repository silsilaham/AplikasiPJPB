// ============================================
// SUPABASE CONFIGURATION
// ============================================
console.log('App.js loaded successfully');

// System Integrity Check
function checkSystemIntegrity() {
    console.log('Starting system integrity check...');
    const requiredIds = [
        'loginForm', 'registerForm', 'loginEmail', 'loginPassword', 
        'registerEmail', 'registerPassword', 'registerPasswordConfirm', 
        'registerBtn', 'authMessage'
    ];
    
    const missing = requiredIds.filter(id => !document.getElementById(id));
    
    if (missing.length > 0) {
        console.error('Missing DOM elements:', missing);
        alert('System Error: Missing required elements: ' + missing.join(', '));
    } else {
        console.log('All required DOM elements found.');
    }

    if (!supabaseClient) {
        console.error('CRITICAL: supabaseClient is null or undefined');
        const msg = 'Gagal memuat koneksi database. Periksa koneksi internet Anda atau coba refresh halaman.';
        showMessage('error', msg);
        // alert('System Error: Database client not initialized');
    } else {
        console.log('Supabase client initialized.');
    }
}

// GANTI DENGAN CREDENTIALS SUPABASE ANDA
const SUPABASE_URL = 'https://qqwbdnizgsqzkxdzvejt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxd2Jkbml6Z3Nxemt4ZHp2ZWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTE3NDMsImV4cCI6MjA4NTYyNzc0M30.HqGif7xwLQe8AxtrtO4x-fMmdf964JQ_IBwe4UuRgEI';

// Global state & Supabase client
let supabaseClient = null;

try {
    if (typeof window.supabase !== 'undefined') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully.');
    } else {
        console.error('Supabase library (CDN) not loaded. Check your internet connection or 503 error.');
    }
} catch (e) {
    console.error('Error initializing Supabase client:', e);
}

let currentUser = null;
let products = [];
let customers = [];
let suppliers = [];
let sales = [];
let purchases = [];
let journals = [];

// Chart of Accounts (Daftar Akun)
const ACCOUNTS = [
    { code: '1-100', name: 'Kas' },
    { code: '1-101', name: 'Bank' },
    { code: '1-200', name: 'Piutang Usaha' },
    { code: '1-300', name: 'Persediaan Barang' },
    { code: '2-100', name: 'Hutang Usaha' },
    { code: '3-100', name: 'Modal' },
    { code: '4-100', name: 'Penjualan' },
    { code: '5-100', name: 'Harga Pokok Penjualan' },
    { code: '6-100', name: 'Beban Gaji' },
    { code: '6-200', name: 'Beban Listrik & Air' },
    { code: '6-300', name: 'Beban Sewa' },
    { code: '6-900', name: 'Beban Lain-lain' }
];

// Global Error Handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global Error:', message, 'at', source, 'line', lineno);
    // Show to user if it's an auth screen
    const messageDiv = document.getElementById('authMessage');
    if (messageDiv && document.getElementById('loginScreen').style.display !== 'none') {
        showMessage('error', 'Browser Error: ' + message);
    }
    return false;
};

// ============================================
// AUTH FUNCTIONS
// ============================================
window.switchAuthTab = function(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.auth-tab');

    if (!loginForm || !registerForm) return;

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        if (tabs[0]) tabs[0].classList.add('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        if (tabs[1]) tabs[1].classList.add('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();

    if (!supabaseClient) {
        showMessage('error', 'Koneksi database belum siap. Silakan refresh halaman.');
        return;
    }

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> <span>Loading...</span>';

    try {
        console.log('Attempting login for:', email);
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        console.log('Login success:', data.user.email);
        currentUser = data.user;
        showApp();
        await loadAllData();

    } catch (error) {
        console.error('Login error:', error);
        let msg = error.message;
        if (msg.includes('rate limit')) {
            msg = 'Terlalu banyak percobaan login. Silakan tunggu beberapa menit.';
        }
        showMessage('error', msg);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Login</span>';
    }
}

async function handleRegister(e) {
    e.preventDefault();

    if (!supabaseClient) {
        showMessage('error', 'Koneksi database belum siap. Silakan refresh halaman.');
        return;
    }

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;
    const btn = document.getElementById('registerBtn');

    if (password !== confirmPassword) {
        showMessage('error', 'Password tidak cocok!');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> <span>Mendaftar...</span>';

    try {
        console.log('Step 1: Data extraction', { email });
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password
        });

        console.log('Step 2: Response received', { data, error });

        if (error) {
            console.error('Registration API Error:', error);
            throw error;
        }

        if (data.user && !data.session) {
            console.log('Registration success: Confirmation email sent');
            showMessage('success', 'Registrasi berhasil! Silakan cek email untuk verifikasi.');
        } else if (data.user) {
            console.log('Registration success: Logged in automatically');
            showMessage('success', 'Registrasi berhasil! Silakan login.');
        } else {
            console.warn('Registration response has no user data');
        }
        
        setTimeout(() => {
            window.switchAuthTab('login');
        }, 1500);

    } catch (error) {
        console.error('Registration error:', error);
        let msg = error.message || 'Terjadi kesalahan saat registrasi';
        if (msg.includes('rate limit')) {
            msg = 'Terlalu banyak percobaan pendaftaran. Silakan tunggu 5-10 menit sebelum mencoba lagi.';
        }
        showMessage('error', msg);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Daftar</span>';
    }
}

async function handleLogout() {
    try {
        await supabaseClient.auth.signOut();
        currentUser = null;

        // Clear data
        products = [];
        customers = [];
        suppliers = [];
        sales = [];
        purchases = [];
        journals = [];

        // Show login screen
        document.getElementById('appContainer').classList.remove('active');
        document.getElementById('loginScreen').style.display = 'flex';

    } catch (error) {
        console.error('Logout error:', error);
    }
}

function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appContainer').classList.add('active');
    document.getElementById('userEmail').textContent = currentUser.email;
}

function showMessage(type, message) {
    const messageDiv = document.getElementById('authMessage');
    messageDiv.className = type === 'error' ? 'alert alert-error' : 'alert alert-success';
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// ============================================
// NAVIGATION
// ============================================
function showPage(page) {
    // Update nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Update content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');

        // Load page data
        if (page === 'dashboard') {
            updateDashboard();
        } else if (page === 'products') {
            loadProducts();
        } else if (page === 'customers') {
            loadCustomers();
        } else if (page === 'suppliers') {
            loadSuppliers();
        } else if (page === 'sales') {
            loadSales();
        } else if (page === 'purchases') {
            loadPurchases();
        } else if (page === 'journal') {
            loadJournal();
        }
    }
}

// ============================================
// DATA LOADING
// ============================================
async function loadAllData() {
    await Promise.all([
        loadProducts(),
        loadCustomers(),
        loadSuppliers(),
        loadSales(),
        loadPurchases(),
        loadJournal()
    ]);

    updateDashboard();
}

async function loadProducts() {
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('code', { ascending: true });

        if (error) throw error;

        products = data || [];
        renderProductsTable();

    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadCustomers() {
    try {
        const { data, error } = await supabaseClient
            .from('customers')
            .select('*')
            .order('code', { ascending: true });

        if (error) throw error;

        customers = data || [];
        renderCustomersTable();

    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

async function loadSuppliers() {
    try {
        const { data, error } = await supabaseClient
            .from('suppliers')
            .select('*')
            .order('code', { ascending: true });

        if (error) throw error;

        suppliers = data || [];
        renderSuppliersTable();

    } catch (error) {
        console.error('Error loading suppliers:', error);
    }
}

async function loadSales() {
    try {
        const { data, error } = await supabaseClient
            .from('sales')
            .select(`
                *,
                customer:customers(name),
                items:sale_items(*)
            `)
            .order('date', { ascending: false });

        if (error) throw error;

        sales = data || [];
        renderSalesTable();

    } catch (error) {
        console.error('Error loading sales:', error);
    }
}

async function loadPurchases() {
    try {
        const { data, error } = await supabaseClient
            .from('purchases')
            .select(`
                *,
                supplier:suppliers(name),
                items:purchase_items(*)
            `)
            .order('date', { ascending: false });

        if (error) throw error;

        purchases = data || [];
        renderPurchasesTable();

    } catch (error) {
        console.error('Error loading purchases:', error);
    }
}

async function loadJournal() {
    try {
        const { data, error } = await supabaseClient
            .from('journals')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        journals = data || [];
        renderJournalTable();

    } catch (error) {
        console.error('Error loading journal:', error);
    }
}

// ============================================
// PRODUCTS
// ============================================
function renderProductsTable() {
    const tbody = document.getElementById('productsTable');

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Belum ada data produk</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td class="text-right">${formatCurrency(product.buy_price)}</td>
            <td class="text-right">${formatCurrency(product.sell_price)}</td>
            <td class="text-right">${product.stock}</td>
            <td class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function openProductModal(id = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');

    form.reset();

    if (id) {
        const product = products.find(p => p.id === id);
        document.getElementById('productModalTitle').textContent = 'Edit Produk';
        document.getElementById('productId').value = product.id;
        document.getElementById('productCode').value = product.code;
        document.getElementById('productName').value = product.name;
        document.getElementById('productBuyPrice').value = product.buy_price;
        document.getElementById('productSellPrice').value = product.sell_price;
        document.getElementById('productStock').value = product.stock;
    } else {
        document.getElementById('productModalTitle').textContent = 'Tambah Produk';
        document.getElementById('productId').value = '';
    }

    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function editProduct(id) {
    openProductModal(id);
}

async function deleteProduct(id) {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
        const { error } = await supabaseClient
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        await loadProducts();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const productData = {
        code: document.getElementById('productCode').value,
        name: document.getElementById('productName').value,
        buy_price: parseFloat(document.getElementById('productBuyPrice').value),
        sell_price: parseFloat(document.getElementById('productSellPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        user_id: currentUser.id
    };

    try {
        if (id) {
            // Update
            const { error } = await supabaseClient
                .from('products')
                .update(productData)
                .eq('id', id);

            if (error) throw error;
        } else {
            // Insert
            const { error } = await supabaseClient
                .from('products')
                .insert([productData]);

            if (error) throw error;
        }

        closeProductModal();
        await loadProducts();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================
// CUSTOMERS
// ============================================
function renderCustomersTable() {
    const tbody = document.getElementById('customersTable');

    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada data pelanggan</td></tr>';
        return;
    }

    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.code}</td>
            <td>${customer.name}</td>
            <td>${customer.address || '-'}</td>
            <td>${customer.phone || '-'}</td>
            <td class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick="editCustomer(${customer.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${customer.id})">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function openCustomerModal(id = null) {
    const modal = document.getElementById('customerModal');
    const form = document.getElementById('customerForm');

    form.reset();

    if (id) {
        const customer = customers.find(c => c.id === id);
        document.getElementById('customerModalTitle').textContent = 'Edit Pelanggan';
        document.getElementById('customerId').value = customer.id;
        document.getElementById('customerCode').value = customer.code;
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerAddress').value = customer.address || '';
        document.getElementById('customerPhone').value = customer.phone || '';
    } else {
        document.getElementById('customerModalTitle').textContent = 'Tambah Pelanggan';
        document.getElementById('customerId').value = '';
    }

    modal.classList.add('active');
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.remove('active');
}

function editCustomer(id) {
    openCustomerModal(id);
}

async function deleteCustomer(id) {
    if (!confirm('Yakin ingin menghapus pelanggan ini?')) return;

    try {
        const { error } = await supabaseClient
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) throw error;

        await loadCustomers();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function handleCustomerSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('customerId').value;
    const customerData = {
        code: document.getElementById('customerCode').value,
        name: document.getElementById('customerName').value,
        address: document.getElementById('customerAddress').value,
        phone: document.getElementById('customerPhone').value,
        user_id: currentUser.id
    };

    try {
        if (id) {
            const { error } = await supabaseClient
                .from('customers')
                .update(customerData)
                .eq('id', id);

            if (error) throw error;
        } else {
            const { error } = await supabaseClient
                .from('customers')
                .insert([customerData]);

            if (error) throw error;
        }

        closeCustomerModal();
        await loadCustomers();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================
// SUPPLIERS
// ============================================
function renderSuppliersTable() {
    const tbody = document.getElementById('suppliersTable');

    if (suppliers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada data supplier</td></tr>';
        return;
    }

    tbody.innerHTML = suppliers.map(supplier => `
        <tr>
            <td>${supplier.code}</td>
            <td>${supplier.name}</td>
            <td>${supplier.address || '-'}</td>
            <td>${supplier.phone || '-'}</td>
            <td class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick="editSupplier(${supplier.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${supplier.id})">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function openSupplierModal(id = null) {
    const modal = document.getElementById('supplierModal');
    const form = document.getElementById('supplierForm');

    form.reset();

    if (id) {
        const supplier = suppliers.find(s => s.id === id);
        document.getElementById('supplierModalTitle').textContent = 'Edit Supplier';
        document.getElementById('supplierId').value = supplier.id;
        document.getElementById('supplierCode').value = supplier.code;
        document.getElementById('supplierName').value = supplier.name;
        document.getElementById('supplierAddress').value = supplier.address || '';
        document.getElementById('supplierPhone').value = supplier.phone || '';
    } else {
        document.getElementById('supplierModalTitle').textContent = 'Tambah Supplier';
        document.getElementById('supplierId').value = '';
    }

    modal.classList.add('active');
}

function closeSupplierModal() {
    document.getElementById('supplierModal').classList.remove('active');
}

function editSupplier(id) {
    openSupplierModal(id);
}

async function deleteSupplier(id) {
    if (!confirm('Yakin ingin menghapus supplier ini?')) return;

    try {
        const { error } = await supabaseClient
            .from('suppliers')
            .delete()
            .eq('id', id);

        if (error) throw error;

        await loadSuppliers();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function handleSupplierSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('supplierId').value;
    const supplierData = {
        code: document.getElementById('supplierCode').value,
        name: document.getElementById('supplierName').value,
        address: document.getElementById('supplierAddress').value,
        phone: document.getElementById('supplierPhone').value,
        user_id: currentUser.id
    };

    try {
        if (id) {
            const { error } = await supabaseClient
                .from('suppliers')
                .update(supplierData)
                .eq('id', id);

            if (error) throw error;
        } else {
            const { error } = await supabaseClient
                .from('suppliers')
                .insert([supplierData]);

            if (error) throw error;
        }

        closeSupplierModal();
        await loadSuppliers();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================
// SALES
// ============================================
function renderSalesTable() {
    const tbody = document.getElementById('salesTable');

    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada transaksi penjualan</td></tr>';
        return;
    }

    tbody.innerHTML = sales.map(sale => `
        <tr>
            <td>${formatDate(sale.date)}</td>
            <td>${sale.invoice_no}</td>
            <td>${sale.customer?.name || '-'}</td>
            <td class="text-right">${formatCurrency(sale.total)}</td>
            <td class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick="viewSale(${sale.id})">Detail</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSale(${sale.id})">Hapus</button>
            </td>
        </tr>
    `).join('');
}

let saleItemCounter = 0;

function openSaleModal() {
    const modal = document.getElementById('saleModal');
    const form = document.getElementById('saleForm');

    form.reset();
    saleItemCounter = 0;

    // Set today's date
    document.getElementById('saleDate').value = new Date().toISOString().split('T')[0];

    // Generate invoice number
    document.getElementById('saleInvoice').value = generateInvoiceNumber('SL');

    // Populate customer dropdown
    const customerSelect = document.getElementById('saleCustomer');
    customerSelect.innerHTML = '<option value="">Pilih Pelanggan</option>' +
        customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    // Clear items
    document.getElementById('saleItems').innerHTML = '<h4 style="margin-bottom: 1rem;">Item Penjualan</h4>';

    // Add first item
    addSaleItem();

    modal.classList.add('active');
}

function closeSaleModal() {
    document.getElementById('saleModal').classList.remove('active');
}

function addSaleItem() {
    const container = document.getElementById('saleItems');
    const itemId = ++saleItemCounter;

    const itemHtml = `
        <div class="invoice-item" id="saleItem${itemId}">
            <div class="invoice-item-header">
                <strong>Item #${itemId}</strong>
                <button type="button" class="remove-item-btn" onclick="removeSaleItem(${itemId})">Hapus</button>
            </div>
            <div class="form-row form-row-3">
                <div class="form-group">
                    <label>Produk</label>
                    <select class="form-input sale-product" onchange="updateSaleItemPrice(${itemId})" required>
                        <option value="">Pilih Produk</option>
                        ${products.map(p => `<option value="${p.id}" data-price="${p.sell_price}">${p.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Jumlah</label>
                    <input type="number" class="form-input sale-qty" min="1" value="1" onchange="calculateSaleTotal()" required>
                </div>
                <div class="form-group">
                    <label>Harga</label>
                    <input type="number" class="form-input sale-price" min="0" value="0" onchange="calculateSaleTotal()" required>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', itemHtml);
}

function removeSaleItem(itemId) {
    const item = document.getElementById('saleItem' + itemId);
    if (item) {
        item.remove();
        calculateSaleTotal();
    }
}

function updateSaleItemPrice(itemId) {
    const item = document.getElementById('saleItem' + itemId);
    const select = item.querySelector('.sale-product');
    const priceInput = item.querySelector('.sale-price');

    const selectedOption = select.options[select.selectedIndex];
    const price = selectedOption.getAttribute('data-price') || 0;

    priceInput.value = price;
    calculateSaleTotal();
}

function calculateSaleTotal() {
    const items = document.querySelectorAll('#saleItems .invoice-item');
    let total = 0;

    items.forEach(item => {
        const qty = parseFloat(item.querySelector('.sale-qty').value) || 0;
        const price = parseFloat(item.querySelector('.sale-price').value) || 0;
        total += qty * price;
    });

    document.getElementById('saleTotal').textContent = formatCurrency(total);
}

async function handleSaleSubmit(e) {
    e.preventDefault();

    const items = document.querySelectorAll('#saleItems .invoice-item');
    if (items.length === 0) {
        alert('Tambahkan minimal 1 item!');
        return;
    }

    const saleData = {
        date: document.getElementById('saleDate').value,
        invoice_no: document.getElementById('saleInvoice').value,
        customer_id: parseInt(document.getElementById('saleCustomer').value),
        total: 0,
        user_id: currentUser.id
    };

    const saleItems = [];
    let total = 0;

    items.forEach(item => {
        const productId = parseInt(item.querySelector('.sale-product').value);
        const qty = parseFloat(item.querySelector('.sale-qty').value);
        const price = parseFloat(item.querySelector('.sale-price').value);
        const subtotal = qty * price;

        total += subtotal;

        saleItems.push({
            product_id: productId,
            qty: qty,
            price: price,
            subtotal: subtotal
        });
    });

    saleData.total = total;

    try {
        // Insert sale
        const { data: newSale, error: saleError } = await supabaseClient
            .from('sales')
            .insert([saleData])
            .select()
            .single();

        if (saleError) throw saleError;

        // Insert sale items
        const itemsWithSaleId = saleItems.map(item => ({
            ...item,
            sale_id: newSale.id
        }));

        const { error: itemsError } = await supabaseClient
            .from('sale_items')
            .insert(itemsWithSaleId);

        if (itemsError) throw itemsError;

        // Create journal entries
        await createSaleJournal(newSale);

        // Update product stock
        for (const item of saleItems) {
            const product = products.find(p => p.id === item.product_id);
            const newStock = product.stock - item.qty;

            await supabaseClient
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.product_id);
        }

        closeSaleModal();
        await loadAllData();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function createSaleJournal(sale) {
    const journalEntries = [
        {
            date: sale.date,
            description: `Penjualan ${sale.invoice_no}`,
            account: 'Kas',
            debit: sale.total,
            credit: 0,
            user_id: currentUser.id,
            reference_type: 'sale',
            reference_id: sale.id
        },
        {
            date: sale.date,
            description: `Penjualan ${sale.invoice_no}`,
            account: 'Penjualan',
            debit: 0,
            credit: sale.total,
            user_id: currentUser.id,
            reference_type: 'sale',
            reference_id: sale.id
        }
    ];

    const { error } = await supabaseClient
        .from('journals')
        .insert(journalEntries);

    if (error) throw error;
}

async function deleteSale(id) {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;

    try {
        // Get sale items to restore stock
        const { data: items } = await supabaseClient
            .from('sale_items')
            .select('*')
            .eq('sale_id', id);

        // Restore stock
        for (const item of items) {
            const product = products.find(p => p.id === item.product_id);
            const newStock = product.stock + item.qty;

            await supabaseClient
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.product_id);
        }

        // Delete journal entries
        await supabaseClient
            .from('journals')
            .delete()
            .eq('reference_type', 'sale')
            .eq('reference_id', id);

        // Delete sale items
        await supabaseClient
            .from('sale_items')
            .delete()
            .eq('sale_id', id);

        // Delete sale
        const { error } = await supabaseClient
            .from('sales')
            .delete()
            .eq('id', id);

        if (error) throw error;

        await loadAllData();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function viewSale(id) {
    const sale = sales.find(s => s.id === id);
    if (!sale) return;

    let details = `DETAIL PENJUALAN\n\n`;
    details += `Tanggal: ${formatDate(sale.date)}\n`;
    details += `No. Invoice: ${sale.invoice_no}\n`;
    details += `Pelanggan: ${sale.customer?.name}\n\n`;
    details += `ITEMS:\n`;

    if (sale.items) {
        sale.items.forEach((item, index) => {
            const product = products.find(p => p.id === item.product_id);
            details += `${index + 1}. ${product?.name} - ${item.qty} x ${formatCurrency(item.price)} = ${formatCurrency(item.subtotal)}\n`;
        });
    }

    details += `\nTOTAL: ${formatCurrency(sale.total)}`;

    alert(details);
}

// ============================================
// PURCHASES
// ============================================
function renderPurchasesTable() {
    const tbody = document.getElementById('purchasesTable');

    if (purchases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada transaksi pembelian</td></tr>';
        return;
    }

    tbody.innerHTML = purchases.map(purchase => `
        <tr>
            <td>${formatDate(purchase.date)}</td>
            <td>${purchase.invoice_no}</td>
            <td>${purchase.supplier?.name || '-'}</td>
            <td class="text-right">${formatCurrency(purchase.total)}</td>
            <td class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick="viewPurchase(${purchase.id})">Detail</button>
                <button class="btn btn-danger btn-sm" onclick="deletePurchase(${purchase.id})">Hapus</button>
            </td>
        </tr>
    `).join('');
}

let purchaseItemCounter = 0;

function openPurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    const form = document.getElementById('purchaseForm');

    form.reset();
    purchaseItemCounter = 0;

    // Set today's date
    document.getElementById('purchaseDate').value = new Date().toISOString().split('T')[0];

    // Generate invoice number
    document.getElementById('purchaseInvoice').value = generateInvoiceNumber('PO');

    // Populate supplier dropdown
    const supplierSelect = document.getElementById('purchaseSupplier');
    supplierSelect.innerHTML = '<option value="">Pilih Supplier</option>' +
        suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    // Clear items
    document.getElementById('purchaseItems').innerHTML = '<h4 style="margin-bottom: 1rem;">Item Pembelian</h4>';

    // Add first item
    addPurchaseItem();

    modal.classList.add('active');
}

function closePurchaseModal() {
    document.getElementById('purchaseModal').classList.remove('active');
}

function addPurchaseItem() {
    const container = document.getElementById('purchaseItems');
    const itemId = ++purchaseItemCounter;

    const itemHtml = `
        <div class="invoice-item" id="purchaseItem${itemId}">
            <div class="invoice-item-header">
                <strong>Item #${itemId}</strong>
                <button type="button" class="remove-item-btn" onclick="removePurchaseItem(${itemId})">Hapus</button>
            </div>
            <div class="form-row form-row-3">
                <div class="form-group">
                    <label>Produk</label>
                    <select class="form-input purchase-product" onchange="updatePurchaseItemPrice(${itemId})" required>
                        <option value="">Pilih Produk</option>
                        ${products.map(p => `<option value="${p.id}" data-price="${p.buy_price}">${p.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Jumlah</label>
                    <input type="number" class="form-input purchase-qty" min="1" value="1" onchange="calculatePurchaseTotal()" required>
                </div>
                <div class="form-group">
                    <label>Harga</label>
                    <input type="number" class="form-input purchase-price" min="0" value="0" onchange="calculatePurchaseTotal()" required>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', itemHtml);
}

function removePurchaseItem(itemId) {
    const item = document.getElementById('purchaseItem' + itemId);
    if (item) {
        item.remove();
        calculatePurchaseTotal();
    }
}

function updatePurchaseItemPrice(itemId) {
    const item = document.getElementById('purchaseItem' + itemId);
    const select = item.querySelector('.purchase-product');
    const priceInput = item.querySelector('.purchase-price');

    const selectedOption = select.options[select.selectedIndex];
    const price = selectedOption.getAttribute('data-price') || 0;

    priceInput.value = price;
    calculatePurchaseTotal();
}

function calculatePurchaseTotal() {
    const items = document.querySelectorAll('#purchaseItems .invoice-item');
    let total = 0;

    items.forEach(item => {
        const qty = parseFloat(item.querySelector('.purchase-qty').value) || 0;
        const price = parseFloat(item.querySelector('.purchase-price').value) || 0;
        total += qty * price;
    });

    document.getElementById('purchaseTotal').textContent = formatCurrency(total);
}

async function handlePurchaseSubmit(e) {
    e.preventDefault();

    const items = document.querySelectorAll('#purchaseItems .invoice-item');
    if (items.length === 0) {
        alert('Tambahkan minimal 1 item!');
        return;
    }

    const purchaseData = {
        date: document.getElementById('purchaseDate').value,
        invoice_no: document.getElementById('purchaseInvoice').value,
        supplier_id: parseInt(document.getElementById('purchaseSupplier').value),
        total: 0,
        user_id: currentUser.id
    };

    const purchaseItems = [];
    let total = 0;

    items.forEach(item => {
        const productId = parseInt(item.querySelector('.purchase-product').value);
        const qty = parseFloat(item.querySelector('.purchase-qty').value);
        const price = parseFloat(item.querySelector('.purchase-price').value);
        const subtotal = qty * price;

        total += subtotal;

        purchaseItems.push({
            product_id: productId,
            qty: qty,
            price: price,
            subtotal: subtotal
        });
    });

    purchaseData.total = total;

    try {
        // Insert purchase
        const { data: newPurchase, error: purchaseError } = await supabaseClient
            .from('purchases')
            .insert([purchaseData])
            .select()
            .single();

        if (purchaseError) throw purchaseError;

        // Insert purchase items
        const itemsWithPurchaseId = purchaseItems.map(item => ({
            ...item,
            purchase_id: newPurchase.id
        }));

        const { error: itemsError } = await supabaseClient
            .from('purchase_items')
            .insert(itemsWithPurchaseId);

        if (itemsError) throw itemsError;

        // Create journal entries
        await createPurchaseJournal(newPurchase);

        // Update product stock
        for (const item of purchaseItems) {
            const product = products.find(p => p.id === item.product_id);
            const newStock = product.stock + item.qty;

            await supabaseClient
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.product_id);
        }

        closePurchaseModal();
        await loadAllData();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function createPurchaseJournal(purchase) {
    const journalEntries = [
        {
            date: purchase.date,
            description: `Pembelian ${purchase.invoice_no}`,
            account: 'Persediaan',
            debit: purchase.total,
            credit: 0,
            user_id: currentUser.id,
            reference_type: 'purchase',
            reference_id: purchase.id
        },
        {
            date: purchase.date,
            description: `Pembelian ${purchase.invoice_no}`,
            account: 'Kas',
            debit: 0,
            credit: purchase.total,
            user_id: currentUser.id,
            reference_type: 'purchase',
            reference_id: purchase.id
        }
    ];

    const { error } = await supabaseClient
        .from('journals')
        .insert(journalEntries);

    if (error) throw error;
}

async function deletePurchase(id) {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;

    try {
        // Get purchase items to restore stock
        const { data: items } = await supabaseClient
            .from('purchase_items')
            .select('*')
            .eq('purchase_id', id);

        // Restore stock
        for (const item of items) {
            const product = products.find(p => p.id === item.product_id);
            const newStock = product.stock - item.qty;

            await supabaseClient
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.product_id);
        }

        // Delete journal entries
        await supabaseClient
            .from('journals')
            .delete()
            .eq('reference_type', 'purchase')
            .eq('reference_id', id);

        // Delete purchase items
        await supabaseClient
            .from('purchase_items')
            .delete()
            .eq('purchase_id', id);

        // Delete purchase
        const { error } = await supabaseClient
            .from('purchases')
            .delete()
            .eq('id', id);

        if (error) throw error;

        await loadAllData();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function viewPurchase(id) {
    const purchase = purchases.find(p => p.id === id);
    if (!purchase) return;

    let details = `DETAIL PEMBELIAN\n\n`;
    details += `Tanggal: ${formatDate(purchase.date)}\n`;
    details += `No. Invoice: ${purchase.invoice_no}\n`;
    details += `Supplier: ${purchase.supplier?.name}\n\n`;
    details += `ITEMS:\n`;

    if (purchase.items) {
        purchase.items.forEach((item, index) => {
            const product = products.find(p => p.id === item.product_id);
            details += `${index + 1}. ${product?.name} - ${item.qty} x ${formatCurrency(item.price)} = ${formatCurrency(item.subtotal)}\n`;
        });
    }

    details += `\nTOTAL: ${formatCurrency(purchase.total)}`;

    alert(details);
}

// ============================================
// JOURNAL
// ============================================
function renderJournalTable() {
    const tbody = document.getElementById('journalTable');

    if (journals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada jurnal</td></tr>';
        return;
    }

    tbody.innerHTML = journals.map(journal => `
        <tr>
            <td>${formatDate(journal.date)}</td>
            <td>${journal.description}</td>
            <td>${journal.account}</td>
            <td class="text-right">${journal.debit > 0 ? formatCurrency(journal.debit) : '-'}</td>
            <td class="text-right">${journal.credit > 0 ? formatCurrency(journal.credit) : '-'}</td>
        </tr>
    `).join('');
}

function openJournalModal() {
    const modal = document.getElementById('journalModal');
    const form = document.getElementById('journalForm');
    const accountSelect = document.getElementById('journalAccount');

    form.reset();
    
    // Set today's date
    document.getElementById('journalDate').value = new Date().toISOString().split('T')[0];

    // Populate Accounts
    accountSelect.innerHTML = '<option value="">Pilih Akun</option>' +
        ACCOUNTS.map(acc => `<option value="${acc.name}">${acc.code} - ${acc.name}</option>`).join('');

    modal.classList.add('active');
}

function closeJournalModal() {
    document.getElementById('journalModal').classList.remove('active');
}

async function handleJournalSubmit(e) {
    e.preventDefault();

    const journalData = {
        date: document.getElementById('journalDate').value,
        description: document.getElementById('journalDesc').value,
        account: document.getElementById('journalAccount').value,
        debit: parseFloat(document.getElementById('journalDebit').value) || 0,
        credit: parseFloat(document.getElementById('journalCredit').value) || 0,
        user_id: currentUser.id
    };

    if (journalData.debit === 0 && journalData.credit === 0) {
        alert('Debit atau Kredit harus diisi!');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('journals')
            .insert([journalData]);

        if (error) throw error;

        closeJournalModal();
        await loadJournal();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function filterJournal() {
    const fromDate = document.getElementById('journalFromDate').value;
    const toDate = document.getElementById('journalToDate').value;

    try {
        let query = supabaseClient
            .from('journals')
            .select('*');

        if (fromDate) {
            query = query.gte('date', fromDate);
        }

        if (toDate) {
            query = query.lte('date', toDate);
        }

        const { data, error } = await query.order('date', { ascending: false });

        if (error) throw error;

        journals = data || [];
        renderJournalTable();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================
// REPORTS
// ============================================
async function generateSalesReport() {
    const fromDate = document.getElementById('salesReportFromDate').value;
    const toDate = document.getElementById('salesReportToDate').value;

    if (!fromDate || !toDate) {
        alert('Pilih tanggal terlebih dahulu!');
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('sales')
            .select(`
                *,
                customer:customers(name)
            `)
            .gte('date', fromDate)
            .lte('date', toDate)
            .order('date', { ascending: false });

        if (error) throw error;

        const tbody = document.getElementById('salesReportTable');

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Tidak ada data</td></tr>';
            return;
        }

        const total = data.reduce((sum, sale) => sum + sale.total, 0);

        tbody.innerHTML = data.map(sale => `
            <tr>
                <td>${formatDate(sale.date)}</td>
                <td>${sale.invoice_no}</td>
                <td>${sale.customer?.name || '-'}</td>
                <td class="text-right">${formatCurrency(sale.total)}</td>
            </tr>
        `).join('') + `
            <tr style="background: var(--bg-secondary); font-weight: bold;">
                <td colspan="3" class="text-right">TOTAL</td>
                <td class="text-right">${formatCurrency(total)}</td>
            </tr>
        `;

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function generatePurchasesReport() {
    const fromDate = document.getElementById('purchasesReportFromDate').value;
    const toDate = document.getElementById('purchasesReportToDate').value;

    if (!fromDate || !toDate) {
        alert('Pilih tanggal terlebih dahulu!');
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('purchases')
            .select(`
                *,
                supplier:suppliers(name)
            `)
            .gte('date', fromDate)
            .lte('date', toDate)
            .order('date', { ascending: false });

        if (error) throw error;

        const tbody = document.getElementById('purchasesReportTable');

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Tidak ada data</td></tr>';
            return;
        }

        const total = data.reduce((sum, purchase) => sum + purchase.total, 0);

        tbody.innerHTML = data.map(purchase => `
            <tr>
                <td>${formatDate(purchase.date)}</td>
                <td>${purchase.invoice_no}</td>
                <td>${purchase.supplier?.name || '-'}</td>
                <td class="text-right">${formatCurrency(purchase.total)}</td>
            </tr>
        `).join('') + `
            <tr style="background: var(--bg-secondary); font-weight: bold;">
                <td colspan="3" class="text-right">TOTAL</td>
                <td class="text-right">${formatCurrency(total)}</td>
            </tr>
        `;

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================
// DASHBOARD
// ============================================
function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];

    // Sales today
    const salesToday = sales.filter(s => s.date === today);
    const totalSalesToday = salesToday.reduce((sum, s) => sum + s.total, 0);
    document.getElementById('statSalesToday').textContent = formatCurrency(totalSalesToday);

    // Purchases today
    const purchasesToday = purchases.filter(p => p.date === today);
    const totalPurchasesToday = purchasesToday.reduce((sum, p) => sum + p.total, 0);
    document.getElementById('statPurchasesToday').textContent = formatCurrency(totalPurchasesToday);

    // Total products
    document.getElementById('statProducts').textContent = products.length;

    // Total customers
    document.getElementById('statCustomers').textContent = customers.length;

    // Recent transactions
    const allTransactions = [
        ...sales.map(s => ({
            date: s.date,
            type: 'Penjualan',
            invoice: s.invoice_no,
            party: s.customer?.name || '-',
            total: s.total
        })),
        ...purchases.map(p => ({
            date: p.date,
            type: 'Pembelian',
            invoice: p.invoice_no,
            party: p.supplier?.name || '-',
            total: p.total
        }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    const tbody = document.getElementById('recentTransactions');

    if (allTransactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Tidak ada transaksi</td></tr>';
        return;
    }

    tbody.innerHTML = allTransactions.map(t => `
        <tr>
            <td>${formatDate(t.date)}</td>
            <td>${t.type}</td>
            <td>${t.invoice}</td>
            <td>${t.party}</td>
            <td class="text-right">${formatCurrency(t.total)}</td>
        </tr>
    `).join('');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

function generateInvoiceNumber(prefix) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    return `${prefix}${year}${month}${day}${random}`;
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Run system check
    checkSystemIntegrity();

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Product form
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);

    // Customer form
    document.getElementById('customerForm').addEventListener('submit', handleCustomerSubmit);

    // Supplier form
    document.getElementById('supplierForm').addEventListener('submit', handleSupplierSubmit);

    // Sale form
    document.getElementById('saleForm').addEventListener('submit', handleSaleSubmit);

    // Purchase form
    document.getElementById('purchaseForm').addEventListener('submit', handlePurchaseSubmit);

    // Journal form
    const journalForm = document.getElementById('journalForm');
    if (journalForm) {
        journalForm.addEventListener('submit', handleJournalSubmit);
    }

    // Check if user is already logged in
    if (supabaseClient) {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                currentUser = session.user;
                showApp();
                loadAllData();
            }
        }).catch(err => {
            console.error('Supabase initialization error:', err);
            showMessage('error', 'Gagal terhubung ke Supabase. Pastikan URL & Key benar.');
        });

        // Listen for auth changes
        supabaseClient.auth.onAuthStateChange((_event, session) => {
            if (session) {
                currentUser = session.user;
                showApp();
                loadAllData();
            } else {
                currentUser = null;
                document.getElementById('appContainer').classList.remove('active');
                document.getElementById('loginScreen').style.display = 'flex';
            }
        });
    } else {
        console.warn('Supabase client not available. Auth listeners not attached.');
        showMessage('error', 'Koneksi database gagal (CDN 503). Silakan refresh halaman.');
    }
});

