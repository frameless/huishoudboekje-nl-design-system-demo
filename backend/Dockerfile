# The build-stage image:
FROM continuumio/miniconda3:4.8.2 AS build

ARG PORT=8000
SHELL ["/bin/bash", "--login", "-c"]

ENV APP=/opt/app
RUN mkdir -p $APP
WORKDIR $APP
# Install the package as normal:
COPY environment.yaml .

RUN conda env create --verbose -f environment.yaml
RUN conda init bash && \
    echo "conda activate hhb-schaalbaar" >> ~/.bashrc


COPY ./app .

EXPOSE $PORT
CMD ["bash", "--login", "-c", "gunicorn --workers=2 --threads=4 --bind=0.0.0.0:${PORT} --worker-class=gthread main:app"]