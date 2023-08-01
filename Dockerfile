FROM node:16
WORKDIR /nest-prac
COPY . .
RUN npm install
CMD ["npm", "run", "start:dev"]
EXPOSE 3000