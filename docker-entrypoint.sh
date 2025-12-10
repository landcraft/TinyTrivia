#!/bin/sh

# Path to the file where we inject environment variables
CONFIG_FILE="/usr/share/nginx/html/env-config.js"

# Start writing the config file
echo "window.__ENV__ = {" > "$CONFIG_FILE"

# Function to safely append environment variables if they exist
add_env_var() {
  var_name=$1
  var_value=$(printenv "$var_name")
  
  if [ -n "$var_value" ]; then
    echo "  \"$var_name\": \"$var_value\"," >> "$CONFIG_FILE"
  fi
}

# Inject specific environment variables needed by the app
add_env_var "API_KEY"
add_env_var "VITE_SUPABASE_URL"
add_env_var "VITE_SUPABASE_ANON_KEY"

# Close the JSON object
echo "};" >> "$CONFIG_FILE"

# Execute the passed command (usually "nginx -g daemon off;")
exec "$@"