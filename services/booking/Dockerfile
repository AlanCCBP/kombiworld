FROM node:24-slim

WORKDIR /usr/src/app

# Copiar package.json primero para instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar todo el código fuente
COPY . .

# Instalar OpenSSL para Prisma
RUN apt-get update -y && apt-get install -y openssl

# Instalar devDependencies necesarias para compilar TS
RUN npm install -D typescript ts-node ts-node-dev

# Generar Prisma Client (antes de compilar)
RUN npx prisma generate

# Compilar TypeScript a JavaScript
RUN rm -rf dist && npx tsc

# Exponer puerto
EXPOSE 4001

# Arrancar la app
CMD ["node", "dist/src/bin/www.js"]
