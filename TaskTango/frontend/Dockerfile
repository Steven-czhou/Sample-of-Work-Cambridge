# Dockerfile for React Frontend

FROM node:22.10.0

# Create app directory
WORKDIR /app

COPY . .

RUN rm -rf package-lock.json
RUN rm -rf node_packages
RUN npm update
RUN npm install

WORKDIR /app/TaskTango
RUN rm -rf package-lock.json
RUN npm update
RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
