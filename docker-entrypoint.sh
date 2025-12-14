#!/bin/sh

# Path to the config file
env_config_file="/usr/share/nginx/html/env-config.js"

# Start the file
echo "window.__ENV__ = {" > "$env_config_file"

# Read environment variables and inject them
# We specifically look for API_KEY and VITE_ prefixed variables
for var in $(env | grep -E '^(API_KEY|VITE_)'); do
    key=$(echo "$var" | cut -d '=' -f 1)
    value=$(echo "$var" | cut -d '=' -f 2-)
    
    # Escape quotes in value to prevent JS syntax errors
    value=$(echo "$value" | sed "s/'/\\\'/g")
    
    echo "  \"$key\": \"$value\"," >> "$env_config_file"
done

# Close the object
echo "};" >> "$env_config_file"

# Execute the passed command (usually nginx)
exec "$@"