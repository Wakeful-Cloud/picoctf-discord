# Use an official lightweight Node image.
# https://hub.docker.com/_/node
FROM node:alphine

# Set environment variable
ENV NODE_ENV=production

# Install production dependencies.
RUN npm i

# Copy local code to the container image.
WORKDIR /app
COPY . .

# Start the app
CMD npm run start
