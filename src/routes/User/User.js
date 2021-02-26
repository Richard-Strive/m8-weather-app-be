const express = require("express");
const mongoose = require("mongoose");
const { authenticate, verifyJWT, refreshTokens } = require("../../auth/tools");
const { authorize } = require("../../auth/middleware");

const User = require("./schema");
const route = express.Router();

route.post("/registration", async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    const { _id } = newUser;
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
  }
});

route.post("/login", async (req, res, next) => {
  try {
    //quando logghi dobbiamo travere lo user con quelle credenziali
    const { surname, password } = req.body;

    const userFound = await User.findByCredentials(surname, password);

    console.log("POST LOGIN CONSOLE LOG--->", userFound);

    // ora generiamo i token
    const { refreshToken, token } = await authenticate(userFound);

    console.log("this is decoded user--->", decode);
    // spedisco il token
    res.status(200).send({ token, refreshToken });
  } catch (error) {
    console.log(error);
  }
});

// se lo user e' autorizzato, possiamo portarto su questo route altrimenti lo reindirizziamo
route.get("/me", async (req, res, next) => {
  try {
    // qui faremo il fetch che poi spediremo al frontend e :id corrispondera' a quello che poi andiamo a
    // specificare nel url

    const token = req.headers.authorization.replace("Bearer ", "");
    const decode = await verifyJWT(token);
    console.log(decode);

    const user = await User.findById(decode._id);

    console.log(user);
    res.status(201).send("CONSOLE LOGGED REQ");
  } catch (error) {
    console.log(error);
  }
});

// aggiungre il route dove SOLO auteticati portremmo aggiungere o cancellare delle citta' preferite nell'array
// sul nostro profilo

module.exports = route;
