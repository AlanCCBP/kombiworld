# Dockerfile for backend service

FROM node:22

# Install PostgreSQL client and wait-for-it script
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    apt-get install -y curl && \
    curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy .env file (assuming it's in the root of your backend directory)
COPY .env ./

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application with wait-for-it and start the server
CMD ["wait-for-it.sh", "db:5432", "--", "sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && npm start"]
