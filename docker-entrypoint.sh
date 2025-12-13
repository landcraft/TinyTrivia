#!/bin/sh

# Define the path to the config file in the Nginx html directory
ENV_CONFIG_FILE=/usr/share/nginx/html/env-config.js

# Write the environment variables to the window object
cat <<EOF > $ENV_CONFIG_FILE
window.__ENV__ = {
  "API_KEY": "${API_KEY}",
  "VITE_SUPABASE_URL": "${VITE_SUPABASE_URL}",
  "VITE_SUPABASE_ANON_KEY": "${VITE_SUPABASE_ANON_KEY}"
};
EOF

# Execute the CMD passed to the docker container (usually starting nginx)
exec "$@"