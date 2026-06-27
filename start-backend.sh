#!/bin/bash
echo "Starting MediSync Backend (Spring Boot)..."
cd "$(dirname "$0")/backend"
mvn spring-boot:run
