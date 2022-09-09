# Imports a default word list into the database when running via docker compose.
# Only runs if no volume is found (i.e. a new database is being made).
mongoimport \
    --uri "${MONGO_URI}" \
    --username "${MONGO_INITDB_ROOT_USERNAME}" \
    --password "${MONGO_INITDB_ROOT_PASSWORD}" \
    --authenticationDatabase admin \
    --db "${MONGO_DB_NAME}" \
    --collection words_english \
    --file /data/words.txt \
    --type csv \
    --fields text