# ---- Stage 1: Install dependencies ----
FROM node:18-alpine

WORKDIR /app

# Copy package files first (for Docker layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Health check for Kubernetes / Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the app
CMD ["node", "app.js"]
