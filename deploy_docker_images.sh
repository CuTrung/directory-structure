#!/bin/bash
docker_repo=writecodesmoothly
services_folder=services

for folder in ${services_folder}/*; do
    if [ -e $folder/Dockerfile ]; then
        service=$(echo "$folder" | awk -F "${services_folder}/" '{print $2}')
        image=${docker_repo}/${service%/}:latest
        echo ">>> Building ${service%/}"
        cd $folder
        docker build -t ${image} .
        docker push -t ${image} .
        sleep 1
        echo ">>> Build ${service%/} completed"
        cd ../../
    fi
done
