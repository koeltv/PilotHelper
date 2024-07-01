#!/bin/sh

envsubst < /usr/share/nginx/html/assets/env.js > /usr/share/nginx/html/assets/temp.js
mv /usr/share/nginx/html/assets/temp.js /usr/share/nginx/html/assets/env.js
exec nginx -g 'daemon off;'
