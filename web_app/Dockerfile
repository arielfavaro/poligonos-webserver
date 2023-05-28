FROM node:18-alpine3.17 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

RUN npm run build


FROM nginx

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
