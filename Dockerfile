# Multi-stage build for frontend and backend
FROM node:18-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app/web

# Copy frontend package files
COPY web/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy frontend source code
COPY web/ ./

# Ensure public directory exists
RUN mkdir -p public

# Build frontend for production
RUN npm run build

# Python stage for backend
FROM python:3.11-slim AS backend-builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY api/requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY api/ ./

# Production stage
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python dependencies from builder
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin

# Copy backend source code
COPY api/ ./

# Copy built frontend from builder
COPY --from=frontend-builder /app/web/out ./web/out
COPY --from=frontend-builder /app/web/.next ./web/.next
COPY --from=frontend-builder /app/web/public ./web/public

# Create nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name _; \
    \
    # Serve frontend static files \
    location / { \
        root /app/web/out; \
        try_files $uri $uri.html $uri/ /index.html; \
    } \
    \
    # Proxy API requests to Flask backend \
    location /v1/ { \
        proxy_pass http://localhost:5001; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/sites-available/default

# Create startup script
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Debug information' >> /app/start.sh && \
    echo 'echo "Starting NDA Redlining Application..."' >> /app/start.sh && \
    echo 'echo "Current directory: $(pwd)"' >> /app/start.sh && \
    echo 'echo "Python version: $(python --version)"' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Set environment variables' >> /app/start.sh && \
    echo 'export FLASK_ENV=production' >> /app/start.sh && \
    echo 'export PORT=${PORT:-5001}' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start Flask backend in background' >> /app/start.sh && \
    echo 'echo "Starting Flask backend on port $PORT..."' >> /app/start.sh && \
    echo 'cd /app && python run.py &' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Wait a moment for Flask to start' >> /app/start.sh && \
    echo 'sleep 5' >> /app/start.sh && \
    echo 'echo "Flask backend started"' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start nginx in foreground' >> /app/start.sh && \
    echo 'echo "Starting nginx..."' >> /app/start.sh && \
    echo 'nginx -g "daemon off;"' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port 80
EXPOSE 80

# Start the application
CMD ["/app/start.sh"]
