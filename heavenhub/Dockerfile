FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:+UseStringDeduplication -XX:+AlwaysPreTouch -Djava.security.egd=file:/dev/urandom"
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT}"]
