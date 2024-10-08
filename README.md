# Floppy Fingers
A drawing game using the Google Handlandmarker and Gesture Recognition API. Implemented using Next.js and Spring Boot.

Currently hosted at [floppyfingers.online](https://floppyfingers.online)
# Dependencies
Node.js version v20.17.0

JDK-17

# Installation
Clone into the repository.

In the /website folder, install Node packages.
```
npm install
```
To run the frontend server:
```
npm run dev
```

In the /backend folder, run the backend server
```
./gradlew.bat bootRun #Omit .bat on Linux systems
```
You will have to modify BackendApplication.java and multiplayerClient.js to use your domain (replace instances of floppyfingers.online).

Access the game by going to the backend server in your browser (it acts as a proxy to the frontend).
