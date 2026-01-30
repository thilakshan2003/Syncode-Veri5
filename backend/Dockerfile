# Backend Development Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5000

# Run with nodemon for auto-reload
CMD ["npx", "nodemon", "--watch", "src", "--exec", "ts-node", "src/index.ts"]
