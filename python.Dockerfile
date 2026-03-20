# python.Dockerfile
FROM python:3.12-slim

# Prevent Python from writing .pyc files & buffering
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /var/www/html

# Install system dependencies (optional but useful)
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies permanently
RUN pip install --no-cache-dir \
    pandas \
    openpyxl \
    python-docx \
    mysql-connector-python

# Keep container alive
CMD ["tail", "-f", "/dev/null"]