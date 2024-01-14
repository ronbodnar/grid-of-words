FROM mongo:6.0

COPY populate-db.sh /docker-entrypoint-initdb.d/populate-db.sh
COPY words_english.txt /data/words_english.txt
COPY words_spanish.txt /data/words_spanish.txt

RUN chmod +x /docker-entrypoint-initdb.d/populate-db.sh
