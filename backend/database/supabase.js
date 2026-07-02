import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://vfmjloppgujpdlaxhhlh.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbWpsb3BwZ3VqcGRsYXhoaGxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ1MjI4NCwiZXhwIjoyMDk4MDI4Mjg0fQ.gaVtIxIhS9YCPyVgfkRzwBZXGKvdt3QtYb3RIbzlSbE';

export const supabase = createClient(supabaseUrl, supabaseKey);
