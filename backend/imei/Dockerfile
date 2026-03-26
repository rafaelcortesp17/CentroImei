# Paso 1: Usar una imagen base de Java (JDK 21 si es tu versión)
FROM eclipse-temurin:17-jdk-alpine

# Paso 2: Crear un directorio de trabajo dentro del contenedor
WORKDIR /app

# Paso 3: Copiar el archivo .jar generado al contenedor
# Nota: Asegúrate de que el nombre coincida con el que está en /target
COPY target/imei-0.0.1-SNAPSHOT.jar app.jar

# Paso 4: Exponer el puerto en el que corre tu app (8080 por defecto)
EXPOSE 8080

# Paso 5: Comando para ejecutar la aplicación al iniciar el contenedor
ENTRYPOINT ["java", "-jar", "app.jar"]