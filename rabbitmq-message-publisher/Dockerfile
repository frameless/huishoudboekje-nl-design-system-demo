FROM alpine:latest

RUN apk --no-cache add curl

COPY send_message.sh /send_message.sh

RUN chmod +x /send_message.sh

ENV RABBITMQ_HOST=rabbitmq
ENV RABBITMQ_PORT=15672
ENV RABBITMQ_USER=guest
ENV RABBITMQ_PASS=guest

CMD ["/send_message.sh"]