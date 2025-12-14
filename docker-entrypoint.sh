#!/bin/sh

# Path to the config file in the Nginx html directory
CONFIG_FILE="/usr/share/nginx/html/env-config.js"

# Recreate the config file
echo "window.__ENV__ = {" > $CONFIG_FILE

# Inject specific environment variables
# This allows you to change keys at runtime without rebuilding the Docker image
if [ -n "$API_KEY" ]; then
  echo "  \"API_KEY\": \"$API_KEY\"," >> $CONFIG_FILE
fi
if [ -n "$VITE_SUPABASE_URL" ]; then
  echo "  \"VITE_SUPABASE_URL\": \"$VITE_SUPABASE_URL\"," >> $CONFIG_FILE
fi
if [ -n "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "  \"VITE_SUPABASE_ANON_KEY\": \"$VITE_SUPABASE_ANON_KEY\"," >> $CONFIG_FILE
fi

# Close the object
echo "};" >> $CONFIG_FILE

# Execute the passed command (usually "nginx -g 'daemon off;'")
exec "$@"