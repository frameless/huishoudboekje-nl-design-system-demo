FROM continuumio/miniconda3:4.8.2 AS build
# Build Conda virtual environment
WORKDIR /opt/app
COPY environment.yaml .

RUN conda env create --quiet --name venv --file environment.yaml && \
    conda init bash && \
    echo "conda activate venv" >> ~/.bashrc

ARG PORT=8000
ARG WORKERS=2
ARG THREADS=4

ENV PORT="${PORT}" \
    WORKERS="${WORKERS}" \
    THREADS="${THREADS}"
EXPOSE ${PORT}

# Runtime envrionment
COPY docker/start.sh .
CMD ["bash", "--login", "-c", "exec ./start.sh"]
SHELL ["/bin/bash", "--login", "-c"]

# Install the app
COPY ./app .
