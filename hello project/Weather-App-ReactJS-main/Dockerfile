# Use an official Node.js runtime as a base image
FROM node:14-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project directory into the working directory
COPY . .

# Build the React app
RUN npm run build

# Use nginx as the web server
FROM nginx:alpine

# Copy the built React app from the build stage into the nginx web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 3000

# Command to run nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]