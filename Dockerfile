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
RUN echo 'server {' > /etc/nginx/sites-available/default && \
    echo '    listen 80;' >> /etc/nginx/sites-available/default && \
    echo '    server_name _;' >> /etc/nginx/sites-available/default && \
    echo '' >> /etc/nginx/sites-available/default && \
    echo '    # Serve frontend static files' >> /etc/nginx/sites-available/default && \
    echo '    location / {' >> /etc/nginx/sites-available/default && \
    echo '        root /app/web/out;' >> /etc/nginx/sites-available/default && \
    echo '        try_files $uri $uri.html $uri/ /index.html;' >> /etc/nginx/sites-available/default && \
    echo '        index index.html;' >> /etc/nginx/sites-available/default && \
    echo '    }' >> /etc/nginx/sites-available/default && \
    echo '' >> /etc/nginx/sites-available/default && \
    echo '    # Proxy API requests to Flask backend' >> /etc/nginx/sites-available/default && \
    echo '    location /v1/ {' >> /etc/nginx/sites-available/default && \
    echo '        proxy_pass http://localhost:5001;' >> /etc/nginx/sites-available/default && \
    echo '        proxy_set_header Host $host;' >> /etc/nginx/sites-available/default && \
    echo '        proxy_set_header X-Real-IP $remote_addr;' >> /etc/nginx/sites-available/default && \
    echo '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' >> /etc/nginx/sites-available/default && \
    echo '        proxy_set_header X-Forwarded-Proto $scheme;' >> /etc/nginx/sites-available/default && \
    echo '    }' >> /etc/nginx/sites-available/default && \
    echo '}' >> /etc/nginx/sites-available/default

# Enable nginx site
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Create startup script
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Debug information' >> /app/start.sh && \
    echo 'echo "Starting NDA Redlining Application..."' >> /app/start.sh && \
    echo 'echo "Current directory: $(pwd)"' >> /app/start.sh && \
    echo 'echo "Python version: $(python --version)"' >> /app/start.sh && \
    echo 'echo "Checking frontend files..."' >> /app/start.sh && \
    echo 'ls -la /app/web/' >> /app/start.sh && \
    echo 'ls -la /app/web/out/' >> /app/start.sh && \
    echo 'echo "Nginx configuration:"' >> /app/start.sh && \
    echo 'cat /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Set environment variables' >> /app/start.sh && \
    echo 'export FLASK_ENV=production' >> /app/start.sh && \
    echo 'export PORT=${PORT:-5001}' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Create nginx config with correct port' >> /app/start.sh && \
    echo 'echo "server {" > /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "    listen 80;" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "    server_name _;" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "    location / {" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "        root /app/web/out;" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "        try_files \$uri \$uri.html \$uri/ /index.html;" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "        index index.html;" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "    }" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "    location /v1/ {" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "        proxy_pass http://localhost:$PORT;" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "        proxy_set_header Host \$host;" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "        proxy_set_header X-Real-IP \$remote_addr;" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "        proxy_set_header X-Forwarded-Proto \$scheme;" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "    }" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'echo "}" >> /etc/nginx/sites-available/default' >> /app/start.sh && \
    echo 'ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start Flask backend in background' >> /app/start.sh && \
    echo 'echo "Starting Flask backend on port $PORT..."' >> /app/start.sh && \
    echo 'cd /app && python run.py &' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Wait a moment for Flask to start' >> /app/start.sh && \
    echo 'sleep 5' >> /app/start.sh && \
    echo 'echo "Flask backend started"' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Test nginx configuration' >> /app/start.sh && \
    echo 'nginx -t' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start nginx in foreground' >> /app/start.sh && \
    echo 'echo "Starting nginx..."' >> /app/start.sh && \
    echo 'nginx -g "daemon off;"' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port 80
EXPOSE 80

# Start the application
CMD ["/app/start.sh"]
