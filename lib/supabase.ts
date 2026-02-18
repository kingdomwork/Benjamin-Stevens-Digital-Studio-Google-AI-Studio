import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahxxtjyqgshnxlgrolgd.supabase.co';
const supabaseKey = 'sb_publishable_iV1Vsed7YV5boeCMfCJu7Q_cgzlJHgI';

export const supabase = createClient(supabaseUrl, supabaseKey);