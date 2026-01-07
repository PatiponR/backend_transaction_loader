# Docker Deployment Guide

This guide explains how to build and deploy the application using Docker.

## Prerequisites

- Docker installed on your machine.

## Build the Image

Run the following command in the project root:

```bash
docker build -t backend-transaction-loader .
```

## Run the Container Locally

To run the container, you need to pass the environment variables (PORT and MONGO_URI).

```bash
docker run -p 5001:5001 \
  -e PORT=5001 \
  -e MONGO_URI="your_mongodb_atlas_connection_string" \
  -e NODE_ENV=production \
  backend-transaction-loader
```

Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas URI (including the password).

## Verify

Access the health check endpoint:
`http://localhost:5001/health`

## Deploy to Cloud (e.g., Render, Railway)

 most modern PaaS providers support Docker deployments directly from a GitHub repository.

1.  **Connect your GitHub repo** to the service.
2.  The service should automatically detect the `Dockerfile`.
3.  **Set Environment Variables** in the service's dashboard:
    *   `MONGO_URI`: Your production MongoDB Atlas URI.
    *   `PORT`: `5001` (or whatever the service expects, usually `$PORT`).
    *   `NODE_ENV`: `production`.
