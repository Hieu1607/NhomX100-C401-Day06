FROM node:20-alpine

WORKDIR /app

ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
