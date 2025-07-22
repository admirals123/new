# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy the Python script to the container
COPY script.py .

# Install PyMongo
RUN pip install pymongo

# Run the script
CMD ["python", "script.py"]