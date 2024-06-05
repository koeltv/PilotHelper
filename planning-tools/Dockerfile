## Stage 1: Build the Application
FROM gradle:8.4.0-jdk17 AS builder
# Move to working directory
WORKDIR /home/project
# Copy gradle files
COPY settings.gradle.kts build.gradle.kts gradle.properties ./
# Download dependencies
RUN ["gradle", "dependencies"]
# Copy the source code
COPY src ./src
# Build the executable
RUN ["gradle", "shadowJar"]

## Stage 2: Create a Minimal Container
FROM bellsoft/liberica-openjre-alpine-musl:17
LABEL authors="Valentin Koeltgen"
EXPOSE 8080
# Copy the executable from the builder container
COPY --from=builder /home/project/build/libs/*.jar /service.jar
# Run the executable
ENTRYPOINT ["java", "-jar", "/service.jar"]