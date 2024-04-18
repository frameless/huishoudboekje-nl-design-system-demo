FROM alpine:latest

RUN apk --no-cache add curl

COPY send_message.sh /send_message.sh

RUN chmod +x /send_message.sh

ENV HHB_RABBITMQ_HOST=rabbitmq
ENV HHB_RABBITMQ_PORT=15672
ENV HHB_RABBITMQ_USER=guest
ENV HHB_RABBITMQ_PASS=guest

CMD ["/send_message.sh"]