#!/bin/sh

# This file is mounted to the /docker-entrypoint-initdb.d/ directory and ran
# automatically when the mongo container creates a new database volume.
until mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  echo "Waiting for MongoDB to start..."
  sleep 5
done

# Import the English word list from /data/words_english.txt into the words_english collection.
mongoimport \
    --host "localhost" \
    --username "${MONGO_INITDB_ROOT_USERNAME}" \
    --password "${MONGO_INITDB_ROOT_PASSWORD}" \
    --authenticationDatabase admin \
    --db "${MONGO_DB_NAME}" \
    --collection words_english \
    --file /data/words_english.txt \
    --type csv \
    --fields text

# Import the Spanish word list from /data/words_spanish.txt into the words_spanish collection.
mongoimport \
    --host "localhost" \
    --username "${MONGO_INITDB_ROOT_USERNAME}" \
    --password "${MONGO_INITDB_ROOT_PASSWORD}" \
    --authenticationDatabase admin \
    --db "${MONGO_DB_NAME}" \
    --collection words_spanish \
    --file /data/words_spanish.txt \
    --type csv \
    --fields text