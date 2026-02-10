FROM node:20-alpine

WORKDIR /app

# Install deps first (better caching)
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/ ./

EXPOSE 5000

CMD ["npm", "start"]