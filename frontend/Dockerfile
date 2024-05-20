FROM node:20-alpine3.17

WORKDIR /frontend

ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

CMD ["npm", "start"]