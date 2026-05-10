#!/bin/bash

set -euo pipefail

# Docker Smoke Test Script
# This script builds and tests the Docker container to ensure it starts correctly
# and responds to basic health checks.

CONTAINER_NAME="webshaped-blog-astro-smoke-test"
IMAGE_NAME="webshaped-blog-astro-smoke:local"
PORT="4321"
TIMEOUT=60  # seconds to wait for container to be healthy
POLL_INTERVAL=2

echo "🐳 Docker Smoke Test"
echo "===================="
echo ""

# Cleanup function
cleanup() {
  local exit_code=$?
  echo ""
  echo "🧹 Cleaning up..."
  
  if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker stop "${CONTAINER_NAME}" 2>/dev/null || true
    docker rm "${CONTAINER_NAME}" 2>/dev/null || true
    echo "✅ Container cleaned up"
  fi
  
  exit $exit_code
}

trap cleanup EXIT

# Step 1: Build Docker image
echo "📦 Step 1: Building Docker image..."
if docker build -t "${IMAGE_NAME}" .; then
  echo "✅ Docker image built successfully"
else
  echo "❌ Docker build failed"
  exit 1
fi

echo ""

# Step 2: Start container
echo "🚀 Step 2: Starting container..."
if docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${PORT}:4321" \
  --env NODE_ENV=production \
  "${IMAGE_NAME}"; then
  echo "✅ Container started (ID: $(docker ps -aqf name=${CONTAINER_NAME}))"
else
  echo "❌ Failed to start container"
  exit 1
fi

echo ""

# Step 3: Wait for container to be healthy
echo "⏳ Step 3: Waiting for container to be ready..."
elapsed=0
while [ $elapsed -lt $TIMEOUT ]; do
  if docker exec "${CONTAINER_NAME}" curl -sf http://localhost:4321/ > /dev/null 2>&1; then
    echo "✅ Container is healthy and responding"
    break
  fi
  
  elapsed=$((elapsed + POLL_INTERVAL))
  if [ $elapsed -lt $TIMEOUT ]; then
    echo "   Waiting... ($elapsed/$TIMEOUT seconds)"
    sleep $POLL_INTERVAL
  fi
done

if [ $elapsed -ge $TIMEOUT ]; then
  echo "❌ Container failed to become healthy within ${TIMEOUT} seconds"
  echo ""
  echo "📋 Container logs:"
  docker logs "${CONTAINER_NAME}" || true
  exit 1
fi

echo ""

# Step 4: Run smoke tests
echo "🧪 Step 4: Running smoke tests..."
echo ""

# Test 4a: Check HTTP 200 on root
echo "  4a. Testing HTTP response on /"
if docker exec "${CONTAINER_NAME}" curl -sf -w "\n  Status: %{http_code}\n" http://localhost:4321/ > /dev/null; then
  echo "  ✅ Root endpoint responds with 200"
else
  echo "  ❌ Root endpoint failed"
  exit 1
fi

# Test 4b: Check content type
echo ""
echo "  4b. Checking content type"
content_type=$(docker exec "${CONTAINER_NAME}" curl -s -I http://localhost:4321/ | grep -i "content-type" | cut -d' ' -f2- || echo "unknown")
echo "  Content-Type: $content_type"
if echo "$content_type" | grep -qi "text/html"; then
  echo "  ✅ Content type is HTML"
else
  echo "  ⚠️  Unexpected content type (expected text/html)"
fi

# Test 4c: Check for error pages
echo ""
echo "  4c. Testing 404 error handling"
http_code=$(docker exec "${CONTAINER_NAME}" curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/nonexistent)
if [ "$http_code" = "404" ]; then
  echo "  ✅ 404 error page working"
else
  echo "  ⚠️  Unexpected status code: $http_code"
fi

echo ""

# Step 5: Check logs for errors
echo "📋 Step 5: Checking container logs for errors..."
if docker logs "${CONTAINER_NAME}" 2>&1 | grep -qi "error\|exception\|fatal"; then
  echo "⚠️  Potential errors found in logs (check manually):"
  docker logs "${CONTAINER_NAME}" | grep -i "error\|exception\|fatal" || true
else
  echo "✅ No obvious errors in logs"
fi

echo ""
echo "================================================"
echo "✨ All smoke tests passed!"
echo "================================================"
echo ""

exit 0
