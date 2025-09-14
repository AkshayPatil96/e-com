FROM node:20.18.0

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

# Start the app with npm run dev:local
CMD [ "npm", "run", "dev:local" ]



