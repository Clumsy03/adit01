FROM node:16.20.2
WORKDIR /app
ENV PORT 9000
COPY . .
RUN npm install
EXPOSE 9000
CMD [ "npm", "run", "start"]