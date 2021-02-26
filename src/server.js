const express = require("express");
const mongoose = require("mongoose");
const listEndpoints = require("express-list-endpoints");

//lavorando con socket devo importare http
const http = require("http");

const cors = require("cors");
require("dotenv").config();

const {
  badRequestHandler,
  unauthorizedHandler,
  frobiddenHandler,
  notFoundHandler,
  catchAllErrorHandler,
} = require("./problematicRoutes/errorHandling.js");

const createSocketServer = require("socket.io");

const userRoute = require("./routes/User/User");

const server = express();
server.use(cors());

///--------------------------- CREAZIONE DEL SERVER ------------------------------------------///
// const httpServer = http.createServer(server);
// createSocketServer(httpServer);

const port = process.env.PORT || 5001;

server.use(express.json());
server.use("/profile", userRoute);

/*<---------
mettere qui gli endpoints con la sintassi e.g:
server.use("/exam", submit)
server.use("/exam", examScore)
----------->*/

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(frobiddenHandler);
server.use(notFoundHandler);
server.use(catchAllErrorHandler);

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log(`Running localhost:${port}`);
    })
  )
  .catch((err) => conso);

console.log(listEndpoints(server));
