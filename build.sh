#!/bin/bash
newTag=$(date +%y.%m.%d)
echo new tag: $newTag

npm install
npm run build

docker build -t shiviraj/nexora-bff:latest -t shiviraj/nexora-bff:$newTag -f ./dockerfile/bff.Dockerfile .
docker push shiviraj/nexora-bff:latest
docker push shiviraj/nexora-bff:$newTag

docker build -t shiviraj/mqtt-handler:latest -t shiviraj/mqtt-handler:$newTag -f ./dockerfile/mqtt-handler.Dockerfile .
docker push shiviraj/mqtt-handler:latest
docker push shiviraj/mqtt-handler:$newTag