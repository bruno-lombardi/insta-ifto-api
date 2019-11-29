FROM mhart/alpine-node:12

WORKDIR /usr/app
COPY package.json yarn.lock ./

RUN yarn cache clean
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
