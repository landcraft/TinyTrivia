#!/bin/sh

# Create env-config.js in the serving directory
# This injects environment variables into the window object at runtime
cat <<EOF > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  API_KEY: "${API_KEY}",
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL}",
  VITE_SUPABASE_ANON_KEY: "${VITE_SUPABASE_ANON_KEY}"
};
EOF

# Start Nginx
exec nginx -g "daemon off;"