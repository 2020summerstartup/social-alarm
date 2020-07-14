#referenced https://github.com/sunwukonga/docker-expo/blob/master/Dockerfile
#referenced https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-docker/manage-windows-dockerfile#instructions

FROM node:14.4.0

#on Sidney's computer, "node -v" yields v14.4.0

# set a directory for the app (in the image filesystem)
WORKDIR /usr/src/app

# COPY format is <source> <destination>
COPY . .
# COPY ./package.json .

# install dependencies (should we install all our libraries here?)
RUN npm install
#RUN npm install -g expo-cli
#RUN npm install react-native
#RUN npm install react-navigation
#RUN npm install expo-notifications
#RUN npm install expo-permissions

# tell the port number the container should expose
EXPOSE 5000

#volumes for updated code?
#mounting

# run the command
CMD ["node", "./App.js"]
# CMD ["npm", "start"]

# copy all the files to the container
# COPY . .