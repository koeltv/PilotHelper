#!/bin/bash

# Determine the current git branch
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Decide the environment based on the branch
if [ "$current_branch" = "https" ]; then
  env_choice="https"
else
  env_choice="http"
fi

echo "Setting up $env_choice environment"

# Define the env directory and subdirectories
env_dir="./env"
env_subdir="${env_dir}/${env_choice}"

# Check if the corresponding subdirectory is empty
if [ -z "$(ls -A $env_subdir 2>/dev/null)" ]; then
  echo "No environment files found, setting up from examples"
  # The subdirectory is empty, copy the .env.example files
  mkdir -p "$env_subdir"
  for file in documentation/env/*.env.example; do
    base_name=$(basename "$file" .env.example)
    cp "$file" "${env_subdir}/${base_name}.env"
  done
fi

# Proceed with the switch-env logic

# Determine the opposite option
if [ "$env_choice" = "http" ]; then
  opposite="https"
else
  opposite="http"
fi

# Create target directory if it doesn't exist
mkdir -p "$env_dir/$opposite"

# Move all files in /env (excluding subdirectories) to the opposite subdirectory
find "$env_dir" -maxdepth 1 -type f -exec mv {} "$env_dir/$opposite/" \;

# Copy all files from the chosen option's subdirectory to /env
cp -r "$env_subdir/"* "$env_dir/"

echo "Environment setup complete for $env_choice."