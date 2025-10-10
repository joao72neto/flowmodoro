# Building .jar

FROM maven:3.9-eclipse-temurin-21 AS build
 
WORKDIR /app

COPY pom.xml ./

COPY src ./src

RUN mvn clean package -DskipTests

# Setting up the production environment

FROM openjdk:21-jdk-slim 

COPY --from=build /app/target/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]