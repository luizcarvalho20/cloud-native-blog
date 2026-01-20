#!/bin/sh
set -e

: "${CREATE_URL:?Defina CREATE_URL}"
: "${LIST_URL:?Defina LIST_URL}"

envsubst '${CREATE_URL} ${LIST_URL}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'
