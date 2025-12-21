FROM node:20

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc

EXPOSE 5000

CMD [ "npm", "run", "start"]
