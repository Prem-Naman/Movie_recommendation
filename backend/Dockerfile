FROM python:3.11-slim

WORKDIR /app

# Install only minimal system dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the emotion model
RUN python -c "from transformers import AutoImageProcessor, AutoModelForImageClassification; \
    m='dima806/facial_emotions_image_detection'; \
    AutoImageProcessor.from_pretrained(m); \
    AutoModelForImageClassification.from_pretrained(m)"

COPY . .

# Cloud Run sets the PORT env var
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
