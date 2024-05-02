#!/bin/sh

# Get all .env.example files from documentation/env directory
for file in documentation/env/*.env.example
do
  # Extract the base name of the file
  base_name=$(basename "$file" .env.example)

  echo "Setting up $base_name env file..."

  # Copy and rename the file to the current directory
  cp "$file" "./$base_name.env"
done

echo "Env files are all ready !"