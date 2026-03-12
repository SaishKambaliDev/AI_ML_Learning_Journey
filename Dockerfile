FROM node:20-alpine

WORKDIR /app

ARG DEMO_MODE=true

# Install only production dependencies first for better layer caching.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source.
COPY . .

ENV NODE_ENV=production
ENV PORT=3000
ENV DEMO_MODE=${DEMO_MODE}

EXPOSE 3000

CMD ["node", "server.js"]
