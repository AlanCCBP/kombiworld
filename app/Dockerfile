# Frontend Dockerfile
# Stage 1: Build the Next.js application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Serve the production build with Node.js
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app ./

# Expose port 3000
EXPOSE 3000

# Command to start Next.js in production mode
CMD ["npm", "run", "dev"]
