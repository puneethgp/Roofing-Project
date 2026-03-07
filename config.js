// 🛠️ Supabase Configuration
// Replace these with your actual values from Supabase Settings > API
const SUPABASE_URL = 'https://tjifcxyupfjmyrijtlvy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaWZjeHl1cGZqbXlyaWp0bHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTk4ODEsImV4cCI6MjA4ODQ3NTg4MX0.myIj0oRRlR5LbGgW4onokW-9YhOFoakLm4_nB0vA8eQ';

// Initialize Supabase Client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

if (!supabase) {
    console.error('❌ Supabase library not loaded. Make sure the script tag is in your HTML.');
} else {
    console.log('✅ Supabase connected and ready.');
}
