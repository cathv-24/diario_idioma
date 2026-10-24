FROM node:22-alpine AS frontend
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_API_URL=/api
RUN npm test && npm run build

FROM maven:3.9-eclipse-temurin-21 AS backend
WORKDIR /build
COPY backend/apidiario/pom.xml ./pom.xml
RUN mvn -B dependency:go-offline
COPY backend/apidiario/src ./src
RUN mvn -B verify
COPY --from=frontend /build/frontend/dist/ ./src/main/resources/static/
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
RUN groupadd --gid 10001 diario && useradd --uid 10001 --gid diario --no-create-home diario && mkdir logs && chown diario:diario logs
COPY --from=backend /build/target/apidiario-1.0.0.jar ./app.jar
USER diario
ENV SPRING_PROFILES_ACTIVE=render
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=65.0 -XX:InitialRAMPercentage=10.0 -XX:+ExitOnOutOfMemoryError"
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]
