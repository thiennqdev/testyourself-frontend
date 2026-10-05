# Multi-stage build
# Stage 1: Build the React/Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy frontend source code
COPY . .

# Build argument cho API URL (mặc định trỏ đến backend localhost:5000/api)
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

# Copy file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts từ Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose cổng 5173
EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
