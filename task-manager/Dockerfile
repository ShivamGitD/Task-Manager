# --- The Builder ---
FROM node:23 as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# --- The Server (Nginx) ---
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Export port 80 (Standard web port)
EXPOSE 80

# Start Nginx
CMD ["nginx","-g","daemon off;"]
