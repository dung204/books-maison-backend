# Stage 1

FROM node:22.3.0-alpine as build_dist
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./


RUN yarn build

# Stage 2

FROM node:22.3.0-alpine as production_node_modules
COPY package.json yarn.lock ./

RUN yarn install --prod --frozen-lockfile

# Stage 3

FROM node:22.3.0-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=production_node_modules /node_modules /usr/src/app/node_modules
COPY --from=build_dist /dist /usr/src/app/dist

COPY . /usr/src/app/

CMD [ "yarn", "start:prod" ]