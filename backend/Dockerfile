# Backend Development Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Accept DATABASE_URL as build argument
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5000

# Run with nodemon for auto-reload
CMD ["npm", "run", "dev"]
