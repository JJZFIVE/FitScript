# Node-stretch-slim allows us to call Python within the nodejs container
FROM node:stretch-slim

# Install yarn package manager
#RUN npm install -g yarn

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package*.json yarn.lock ./

# Install app dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the container
COPY . .

# Build TypeScript code
RUN yarn build

# Expose port 6969 for the application to listen on
EXPOSE 6969

# Set environment variables
ENV NODE_ENV=production
ENV PORT=6969

# Start the application
CMD [ "yarn", "start" ]
