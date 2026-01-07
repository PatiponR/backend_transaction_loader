# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 5001

# Command to run the application
CMD ["npm", "start"]
