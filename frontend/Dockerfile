## Stage 1: Build the Application
FROM node:20.14.0-alpine3.20 AS builder
# Move to working directory & disable analytics
WORKDIR /usr/src/app
ENV NG_CLI_ANALYTICS="false"
# Copy Node files & install dependencies
COPY package.json package-lock.json ./
RUN ["npm", "ci"]
# Copy Angular files
COPY angular.json tsconfig.app.json tsconfig.json tsconfig.spec.json ngsw-config.json eslint.config.js ./
# Copy the source code & resources
COPY m3-theme.scss m3-theme.scss
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
# Replace environment variables and run the Nginx server
ENTRYPOINT envsubst < /usr/share/nginx/html/env.js > /usr/share/nginx/html/temp.js && mv /usr/share/nginx/html/temp.js /usr/share/nginx/html/env.js && exec nginx -g 'daemon off;'
