# Dockerfile for Spring Boot Backend

# Start with an official OpenJDK image
FROM openjdk:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the build files (pom.xml and source code)
COPY . .

# Run spring boot
RUN ./mvnw clean package

# Expose the port Spring Boot is using (usually 8080)
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "task-tango-server/target/task-tango-server-0.0.1-SNAPSHOT.jar"]
