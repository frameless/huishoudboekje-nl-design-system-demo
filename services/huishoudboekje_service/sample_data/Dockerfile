FROM postgres:11

WORKDIR /data
COPY huishoudboekje_db /data
COPY load_data.sql /data
COPY load_data.sh /data

CMD ["load_data.sh"]
