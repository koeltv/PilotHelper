# Set the base image to NGINX alpine
FROM nginx:alpine3.17
# Copy the configuration file inside the container
COPY nginx.conf /etc/nginx/nginx.conf
# Copy the web application inside the container
COPY /target/angular /usr/share/nginx/html
# When the container starts, replace the env.js values from environment variables
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/env.sample.js > /usr/share/nginx/html/env.js && exec nginx -g 'daemon off;'"]
LABEL authors="Valentin KOELTGEN"
