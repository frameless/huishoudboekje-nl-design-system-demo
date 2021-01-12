FROM postgres:11-alpine

WORKDIR /data
COPY docker/ /data/
COPY data/ /data/

CMD ["./load.sh"]
