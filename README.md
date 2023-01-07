![image](https://user-images.githubusercontent.com/89903354/205939242-f44a4ec9-a70e-406b-b697-605f873ece93.png)

## Setting up Mongodb:

1. Install Docker
2. Run the following command to pull the <strong>latest</strong> version of MongoDb from the Docker Hub:
```
   docker pull mongo
```
3. Run the following command to start a MongoDb container and bind it to the default MongoDB port (27017):
```
   docker run -d -p 27017:27017 --name mongodb mongo 
```
4. Verify that the MongoDB container is running by using the following command:
```
   docker ps
```
5. Connect to the MongoDB server by using a MongoDB client, and connecting to the default host and port(localhost:27017):
```
   mongo 
```
6. Run the following command to start the MongoDB container:
```
   docker start mongodb
```
7. Run the following command to stop the MongoDB container:
```
   docker stop mongodb
```

## Environment variables
1. Create a copy of the .env.sample file and save it as .env
2. Open the .env file
3. Edit the values in the .env file to match your specific environment
4. Save the .env file
5. Use the values in the .env file to configure your application
