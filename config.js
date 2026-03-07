// 🛠️ Supabase Configuration
// Replace these with your actual values from Supabase Settings > API
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase Client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

if (!supabase) {
    console.error('❌ Supabase library not loaded. Make sure the script tag is in your HTML.');
} else {
    console.log('✅ Supabase connected and ready.');
}
