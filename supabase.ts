import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ctflbmiubripqoggmhdl.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFhN2VmZGRiLTU4NDItNDlhZS04ZDNiLTBmYTA3OTA2YTY5ZSJ9.eyJwcm9qZWN0SWQiOiJjdGZsYm1pdWJyaXBxb2dnbWhkbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzYzNDA1MjI4LCJleHAiOjIwNzg3NjUyMjgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.nK-fFGbME3lU1vYRXp8Ngddx0ucNN3kC0DSTVSd7cOI';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };