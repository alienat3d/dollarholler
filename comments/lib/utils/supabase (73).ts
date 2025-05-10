import { createClient } from '@supabase/supabase-js';
// import { env } from '$env/dynamic/public';
// 73.0 Вариант с динамическим env почему-то вызывал ошибку и также в самой свежей доке указан такой вариант.
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

export default supabase;
