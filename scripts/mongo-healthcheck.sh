#!/bin/bash

# Run MongoDB script to count words and redirect output to /data/wordcount.txt
mongosh \
    --quiet \
    --host word-puzzle-game-db \
    --authenticationDatabase admin \
    --username ${MONGO_INITDB_ROOT_USERNAME} \
    --password ${MONGO_INITDB_ROOT_PASSWORD} \
    --file /scripts/count-words.js \
    ${MONGO_DB_NAME} > /data/wordcount.txt

if [ -s /data/wordcount.txt ]; then
    WC=$(cat /data/wordcount.txt)
    echo "The word count is: $WC"
else
    echo "Error: Word count file is empty or does not exist."
fi