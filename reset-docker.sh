#!/bin/bash

# Stop and remove all running containers
echo "Stopping and removing all running containers..."
docker stop $(docker ps -aq) 2>/dev/null
docker rm $(docker ps -aq) 2>/dev/null

# Remove all volumes
echo "Removing all volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null

echo "Docker cleanup complete!"
