#!/bin/bash
chown -R node:node /etc/letsencrypt
chmod -R 777 /etc/letsencrypt
exec "$@"
