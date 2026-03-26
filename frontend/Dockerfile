# Paso 1: Compilación (Build)
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Paso 2: Servidor de Producción (Nginx)
FROM nginx:alpine
# Copia el build de Angular (ajusta 'dist/nombre-tu-proyecto' según tu carpeta)
# En Angular 17+ suele ser dist/nombre-proyecto/browser
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]