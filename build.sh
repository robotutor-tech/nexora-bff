#!/bin/bash
set -e  # Exit on error

newTag=$(date +%y.%m.%d)
echo "🏷️  New tag: $newTag"

# No need to build locally anymore - Docker will handle it
echo "🐳 Building Docker images with multi-stage builds..."

# Build BFF
echo "📦 Building nexora-bff..."
docker build \
  --target production \
  -t shiviraj/nexora-bff:latest \
  -t shiviraj/nexora-bff:$newTag \
  -f ./dockerfile/bff.Dockerfile \
  .

echo "⬆️  Pushing nexora-bff..."
docker push shiviraj/nexora-bff:latest
docker push shiviraj/nexora-bff:$newTag

# Build MQTT Handler
echo "📦 Building mqtt-handler..."
docker build \
  --target production \
  -t shiviraj/mqtt-handler:latest \
  -t shiviraj/mqtt-handler:$newTag \
  -f ./dockerfile/mqtt-handler.Dockerfile \
  .

echo "⬆️  Pushing mqtt-handler..."
docker push shiviraj/mqtt-handler:latest
docker push shiviraj/mqtt-handler:$newTag

# Show image sizes
echo ""
echo "📊 Image sizes:"
docker images | grep -E "REPOSITORY|shiviraj/(nexora-bff|mqtt-handler)" | grep -E "REPOSITORY|latest"

echo ""
echo "✅ Build and push completed successfully!"
