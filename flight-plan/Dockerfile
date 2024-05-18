## Stage 1: Build the Application
FROM eclipse-temurin:17-jdk AS builder
# Move to working directory
WORKDIR /home/project
# Copy gradle files
COPY gradle ./gradle
COPY gradlew settings.gradle.kts build.gradle.kts gradle.properties ./
RUN ["chmod", "+x", "./gradlew"]
# Build custom JRE
#RUN ["./gradlew", "jre", "--no-daemon"]
# Download dependencies
RUN ["./gradlew", "--refresh-dependencies", "--no-daemon"]
# Copy the source code
COPY src ./src
# Build the executable
RUN ["./gradlew", "shadowJar", "--no-daemon"]

## Stage 2: Create a Minimal Container
#FROM alpine:3.18.3
FROM eclipse-temurin:17-jre-alpine
LABEL authors="Valentin Koeltgen"
EXPOSE 8000
# Copy the custom JRE from the builder container
#COPY --from=builder /home/project/build/jre/*-alpine-linux /jre
# Copy the executable from the builder container
COPY --from=builder /home/project/build/libs/*.jar /service.jar
# Run the executable
#ENTRYPOINT ["/jre/bin/java", "-jar", "/service.jar"]
ENTRYPOINT ["java", "-jar", "/service.jar"]