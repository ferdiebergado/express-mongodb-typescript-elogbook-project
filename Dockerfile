FROM node:16.0.0-buster AS base

ENV APP_DIR /app
ENV PORT 1995

ARG NODE_ENV

#RUN mkdir -p ${APP_DIR}

WORKDIR ${APP_DIR}

#RUN adduser -S app

COPY package*.json .

FROM base AS dependencies

RUN if [ "$NODE_ENV" === "development"]; then \
        npm install \
    else \
        npm install --only=production \
    fi

FROM dependencies AS src

# TODO: Dockerfile for development
COPY . .

FROM src AS build

RUN npm run build

FROM src AS release 

COPY .env ./dist

#RUN chown -R node ${APP_DIR}

USER node

WORKDIR ${APP_DIR}/dist

EXPOSE ${PORT}

CMD node app.js
