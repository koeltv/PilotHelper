#!/bin/sh

# For a given subfolder SUBFOLDER, check for Dockerfile, if there is,
# find documentation.yaml in subdirectories, if it exists,
# build and run the container and run Schemathesis on it

# Define the subfolder and internal port from command line arguments
SUBFOLDER=$1
INTERNAL_PORT="${2:-8000}"

# Regex for alphanumeric characters
SUBFOLDER_REGEX='^[a-zA-Z0-9-]+$'

# Regex for valid port number
PORT_REGEX='^[1-9][0-9]{0,4}$'

# Check if SUBFOLDER only contains alphanumeric characters
if echo "$SUBFOLDER" | grep -Eqv "$SUBFOLDER_REGEX"; then
    echo "Error: SUBFOLDER \"$SUBFOLDER\" should only contain valid characters ($SUBFOLDER_REGEX)"
    exit 1
fi

# Check if INTERNAL_PORT is a valid port number
if echo "$INTERNAL_PORT" | grep -Eqv "$PORT_REGEX" || [ "$INTERNAL_PORT" -gt 65535 ]; then
    echo "Error: INTERNAL_PORT should be a valid port number (1-65535)."
    exit 1
fi

# Check if Dockerfile exists in the subfolder
if [ -f "$SUBFOLDER/Dockerfile" ]; then
    echo "--- Dockerfile found in $SUBFOLDER"

    # Find documentation.yaml in subdirectories
    DOCUMENTATION_YAML_DIRECTORY=$(find "$SUBFOLDER" -type f -name "documentation.yaml" -exec dirname {} \; | head -n 1)

    # If documentation.yaml directory found, build and run Dockerfile
    if [ -n "$DOCUMENTATION_YAML_DIRECTORY" ]; then
        echo "documentation.yaml found in $DOCUMENTATION_YAML_DIRECTORY"

        docker network create -d bridge testing-env

        echo "--- Build and run Dockerfile in $SUBFOLDER"
        docker build -t pilot-helper/"$SUBFOLDER" "$SUBFOLDER" -q && \
        CONTAINER_ID=$(docker run -d --name my-tested-service --network testing-env pilot-helper/"$SUBFOLDER")

        echo "--- Build and run Schemathesis in $SUBFOLDER"
        HOST_SIDE_VOLUME=$(echo "${DOCUMENTATION_YAML_DIRECTORY}" | sed 's/\\/\//g')
        MSYS_NO_PATHCONV=1 docker run --rm --network testing-env -v "$(pwd)/$HOST_SIDE_VOLUME:/api" schemathesis/schemathesis:v3.21.0-buster \
        run --checks all --base-url "http://my-tested-service:$INTERNAL_PORT" /api/documentation.yaml

        echo "--- Cleaning up"
        docker rm -f "$CONTAINER_ID"
        docker network rm testing-env
    else
        echo "documentation.yaml not found in any subdirectory of $SUBFOLDER"
    fi
else
    echo "Dockerfile not found in $SUBFOLDER"
fi
