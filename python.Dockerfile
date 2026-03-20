FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    pandas openpyxl python-docx mysql-connector-python \
    flask gunicorn

EXPOSE 5000

# Use the full absolute path from the root of the container
CMD ["python", "/var/www/html/app/Python/server.py"]