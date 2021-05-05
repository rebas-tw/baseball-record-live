FROM node:14.16.1-alpine AS frontend-builder
RUN apk add python make g++
WORKDIR /app
COPY frontend /app/
ARG FRONTEND_ENV_FILE
COPY $FRONTEND_ENV_FILE /app/.env
RUN yarn install && yarn build

FROM node:14.16.1-alpine AS backend-builder
RUN apk add python make g++
WORKDIR /app
COPY . /app/
RUN yarn install

FROM node:14.16.1-alpine
RUN apk add --no-cache tzdata
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=backend-builder /app/ /
COPY --from=frontend-builder /app/build /frontend/build
ARG BACKEND_ENV_FILE
COPY $BACKEND_ENV_FILE /.env
CMD ["node", "app.js"]
