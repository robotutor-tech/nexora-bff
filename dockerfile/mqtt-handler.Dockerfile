# Stage 1: Dependencies - Install production dependencies only
FROM node:22.14-alpine AS dependencies
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only and fix vulnerabilities
# Use --omit=dev instead of deprecated --only=production
RUN npm ci --omit=dev && \
    npm audit fix --omit=dev || true && \
    npm cache clean --force

# Stage 2: Build - Build the application
FROM node:22.14-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production - Create minimal production image
FROM node:22.14-alpine AS production
WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy package files
COPY package*.json ./

# Copy built application from builder stage
COPY --from=builder /app/dist/apps/mqtt-handler ./dist/mqtt-handler

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

EXPOSE 3002

CMD [ "node", "dist/mqtt-handler/main" ]