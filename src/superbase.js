import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ekotmscziycfbqdyglzb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrb3Rtc2N6aXljZmJxZHlnbHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMjUyMzgsImV4cCI6MjA1MTkwMTIzOH0.r6p0XDDF3n_zOrKCo0XEEYb8MDEzr0hpT2_KwOa0qcQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
