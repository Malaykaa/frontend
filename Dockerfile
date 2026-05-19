# ── Stage 1 : build React ─────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

COPY . .

# VITE_API_URL doit être vide en prod — le proxy nginx gère /api → backend.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


# ── Stage 2 : serveur nginx ───────────────────────────────────────────────────
FROM nginx:1.27-alpine AS server

# Config nginx injectée par docker-compose (volume ou COPY)
COPY --from=builder /app/dist /usr/share/nginx/html

# Supprime la config par défaut — remplacée par nginx.conf via docker-compose volume
RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
