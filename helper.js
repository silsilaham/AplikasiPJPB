/* 
 * PETUNJUK CEPAT - COPY PASTE KE BROWSER
 * Buka Chrome/Firefox Developer Console (F12)
 * Paste script ini untuk test koneksi Supabase
 */

// Test Supabase Connection
async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase Connection...');

    // Ganti dengan credentials Anda
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

    if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        console.error('❌ ERROR: Belum mengganti SUPABASE_URL di app.js!');
        console.log('📝 Silakan edit file app.js dan ganti:');
        console.log('   const SUPABASE_URL = "YOUR_SUPABASE_URL";');
        console.log('   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";');
        return;
    }

    try {
        const response = await fetch(SUPABASE_URL + '/rest/v1/', {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (response.ok) {
            console.log('✅ Supabase connection successful!');
        } else {
            console.error('❌ Connection failed:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Sample Data untuk Testing
const sampleData = {
    products: [
        { code: 'P001', name: 'Laptop ASUS', buy_price: 7000000, sell_price: 8500000, stock: 10 },
        { code: 'P002', name: 'Mouse Wireless', buy_price: 75000, sell_price: 150000, stock: 50 },
        { code: 'P003', name: 'Keyboard Mechanical', buy_price: 350000, sell_price: 550000, stock: 25 },
        { code: 'P004', name: 'Monitor 24 inch', buy_price: 1500000, sell_price: 2000000, stock: 15 },
        { code: 'P005', name: 'Headset Gaming', buy_price: 300000, sell_price: 450000, stock: 30 }
    ],
    customers: [
        { code: 'C001', name: 'PT Maju Jaya', address: 'Jl. Sudirman No. 123, Jakarta', phone: '021-12345678' },
        { code: 'C002', name: 'CV Sejahtera', address: 'Jl. Thamrin No. 45, Bandung', phone: '022-98765432' },
        { code: 'C003', name: 'Toko Elektronik Makmur', address: 'Jl. Ahmad Yani No. 78, Surabaya', phone: '031-55556666' },
        { code: 'C004', name: 'UD Berkah', address: 'Jl. Diponegoro No. 90, Semarang', phone: '024-77778888' },
        { code: 'C005', name: 'PT Global Tech', address: 'Jl. Gatot Subroto No. 12, Jakarta', phone: '021-99998888' }
    ],
    suppliers: [
        { code: 'S001', name: 'PT Distributor Komputer', address: 'Jl. Industri No. 100, Jakarta', phone: '021-66667777' },
        { code: 'S002', name: 'CV Parts Center', address: 'Jl. Raya Bogor No. 200, Bogor', phone: '0251-333444' },
        { code: 'S003', name: 'Toko Grosir Elektronik', address: 'Jl. Pasar Baru No. 50, Jakarta', phone: '021-22223333' },
        { code: 'S004', name: 'PT Importir Teknologi', address: 'Jl. MT Haryono No. 150, Jakarta', phone: '021-88889999' },
        { code: 'S005', name: 'UD Supplier Jaya', address: 'Jl. Veteran No. 25, Bandung', phone: '022-11112222' }
    ]
};

// Function untuk insert sample data
async function insertSampleData() {
    if (!currentUser) {
        console.error('❌ Harus login terlebih dahulu!');
        return;
    }

    console.log('📦 Inserting sample data...');

    try {
        // Insert Products
        console.log('Adding products...');
        for (const product of sampleData.products) {
            await supabase.from('products').insert([{ ...product, user_id: currentUser.id }]);
        }
        console.log('✅ Products added!');

        // Insert Customers
        console.log('Adding customers...');
        for (const customer of sampleData.customers) {
            await supabase.from('customers').insert([{ ...customer, user_id: currentUser.id }]);
        }
        console.log('✅ Customers added!');

        // Insert Suppliers
        console.log('Adding suppliers...');
        for (const supplier of sampleData.suppliers) {
            await supabase.from('suppliers').insert([{ ...supplier, user_id: currentUser.id }]);
        }
        console.log('✅ Suppliers added!');

        console.log('🎉 Sample data inserted successfully!');
        console.log('Reload halaman untuk melihat data...');

        // Reload data
        await loadAllData();

    } catch (error) {
        console.error('❌ Error inserting data:', error);
    }
}

console.log('📚 Helper Functions Loaded!');
console.log('Commands:');
console.log('  testSupabaseConnection() - Test koneksi ke Supabase');
console.log('  insertSampleData() - Insert data sample (harus login dulu)');
