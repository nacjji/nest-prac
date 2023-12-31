FROM node:16
WORKDIR /nest-prac
COPY . .
RUN rm -rf node_modules
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]
EXPOSE 8000



