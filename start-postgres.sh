#!/bin/bash

# PostgreSQL Docker startup script for tenant-final project

CONTAINER_NAME="tenant-final-postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_USER="postgres"
POSTGRES_DB="tenant-final"
POSTGRES_PORT="5432"

echo "Starting PostgreSQL container for tenant-final project..."

# Check if container already exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Container $CONTAINER_NAME already exists."
    
    # Check if it's running
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        echo "Container $CONTAINER_NAME is already running."
        echo "PostgreSQL is available at: postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$POSTGRES_DB"
        exit 0
    else
        echo "Starting existing container..."
        docker start $CONTAINER_NAME
    fi
else
    echo "Creating and starting new PostgreSQL container..."
    docker run -d \
        --name $CONTAINER_NAME \
        -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
        -e POSTGRES_USER=$POSTGRES_USER \
        -e POSTGRES_DB=$POSTGRES_DB \
        -p $POSTGRES_PORT:5432 \
        -v tenant-final-postgres-data:/var/lib/postgresql/data \
        postgres:15-alpine
fi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 3

# Check if PostgreSQL is ready
docker exec $CONTAINER_NAME pg_isready -U $POSTGRES_USER -d $POSTGRES_DB

if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL is ready!"
    echo "Connection details:"
    echo "  Host: localhost"
    echo "  Port: $POSTGRES_PORT"
    echo "  Database: $POSTGRES_DB"
    echo "  Username: $POSTGRES_USER"
    echo "  Password: $POSTGRES_PASSWORD"
    echo "  URL: postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$POSTGRES_DB"
    echo ""
    echo "To connect using psql:"
    echo "  docker exec -it $CONTAINER_NAME psql -U $POSTGRES_USER -d $POSTGRES_DB"
    echo ""
    echo "To stop the container:"
    echo "  docker stop $CONTAINER_NAME"
else
    echo "❌ PostgreSQL failed to start properly"
    exit 1
fi