# Use the base node lts-buster-slim
FROM node:lts-buster-slim

# Set /app as the working directory
WORKDIR /app

# set environment variables
ENV IMG_WIDTH=1800
ENV IMG_QUALITY=75

# update the image packages & install node packages
RUN yarn add sharp cli-progress

# copy sharp app to the workdir
COPY app .


CMD [ "node",  "index.js" ]
