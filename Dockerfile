FROM node:16
WORKDIR /nest-prac
COPY . .
RUN rm -rf node_modules
RUN npm install
CMD ["npm", "run", "start:dev"]
EXPOSE 8000



