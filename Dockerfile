# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Use npm install instead of npm ci to support builds without a lockfile
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Set the entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]