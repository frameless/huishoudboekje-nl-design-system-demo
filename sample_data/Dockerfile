FROM postgres:11

WORKDIR /data
COPY docker/* /data/
COPY data/* /data/

CMD ["load.sh"]
