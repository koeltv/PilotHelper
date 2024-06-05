## Stage 1: Build the Application
FROM node:20.14.0-alpine3.20 AS builder
# Move to working directory & disable analytics
WORKDIR /usr/src/app
ENV NG_CLI_ANALYTICS="false"
# Copy Node files & install dependencies
COPY package.json package-lock.json ./
RUN ["npm", "install"]
# Copy Angular files
COPY angular.json tsconfig.app.json tsconfig.json tsconfig.spec.json ngsw-config.json ./
# Copy the source code & resources
COPY public public
COPY src src
# Build the application bundle
RUN ["npm", "run", "build"]

## Stage 2: Create a Minimal NGINX Container
FROM nginx:alpine3.19-slim
EXPOSE 80
# Copy the configuration file inside the container
COPY nginx.conf /etc/nginx/nginx.conf
# Copy the web application inside the container
COPY --from=builder /usr/src/app/dist/frontend/browser /usr/share/nginx/html
