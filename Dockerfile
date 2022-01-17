FROM node:14-slim
RUN apt update && apt install git python3 build-essential libudev-dev libusb-1.0-0-dev -y
WORKDIR /usr/src/app/
COPY . .
RUN yarn
RUN yarn build


FROM nginx:stable-alpine
COPY --from=0 /usr/src/app/build /usr/share/nginx/html/superadmin
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
