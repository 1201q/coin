FROM node:20

RUN mkdir -p /app
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

EXPOSE 8000
CMD ["node", "dist/main.js"]