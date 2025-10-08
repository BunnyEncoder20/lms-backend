# Use a lightweight Node.js 20 image
FROM node:20-alpine as development

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package files first (better layer caching)
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose NestJS default port
EXPOSE 3000

# Run in development mode with hot reload
CMD ["npm", "run", "start:dev"]
