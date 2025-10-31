FROM node:22.21.1 AS builder

WORKDIR /app

# Build argument for shortener domain (required - must be provided via build args)
ARG VITE_SHORTENER_DOMAIN
ENV VITE_SHORTENER_DOMAIN=${VITE_SHORTENER_DOMAIN}

# Copy package files
COPY package*.json ./

# Install dependencies
# Use npm ci if package-lock.json exists, otherwise npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --prefer-offline; \
    else \
      npm install; \
    fi

# Copy application files
COPY . .

# Build the application
RUN npm run build

FROM nginx:1.29-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

