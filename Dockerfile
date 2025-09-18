# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN npm install --frozen-lockfile
# or if using yarn: RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN npm run build
# or if using yarn: RUN yarn build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
# or if using yarn: CMD ["yarn", "start"]