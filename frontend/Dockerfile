# Use Node.js base image
FROM node:20 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN chmod -R 755 /usr/src/app
RUN npm install

# Copy application code
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight web server for production
FROM nginx:alpine

# Copy the build output to the NGINX directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the web server port
EXPOSE 80

# Run NGINX
CMD ["nginx", "-g", "daemon off;"]
