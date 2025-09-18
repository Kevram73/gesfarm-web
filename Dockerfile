# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json only
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]