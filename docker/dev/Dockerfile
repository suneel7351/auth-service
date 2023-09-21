FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./

#install dependencies
RUN npm install


# Copy the rest of app's source code into the container
COPY . .
#Expose the port the app will run on
EXPOSE 5501

# Command to run the app
CMD ["npm","run","dev"]