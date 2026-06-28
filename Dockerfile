FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install
COPY bot.js ./
ENV PORT=10000
CMD ["node", "bot.js"]
