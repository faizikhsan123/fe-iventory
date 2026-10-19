# ---------- Tahap 1: Build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx vite build

# ---------- Tahap 2: Sajikan ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Menggunakan /app/dist karena projek Anda berbasis Vite
COPY --from=build /app/dist /usr/share/nginx/html
