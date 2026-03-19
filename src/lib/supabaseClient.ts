import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nwwoiszwlmocwtctgbgv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53d29pc3p3bG1vY3d0Y3RnYmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTg5MjEsImV4cCI6MjA4OTQzNDkyMX0.5YyOIIck_Rdhhv1sbeMTK_hvjlV6QLuxxghRJ4fONLo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
