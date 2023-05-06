import http from 'http'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
Promise = require('bluebird')
const path = require('path')

import { Server, LobbyRoom } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { RoomType } from './types/Rooms'

import { CrosmoRoom } from './rooms/CrosmoRoom'

const routes = require('./index.route');

dotenv.config()

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', routes)

app.use(express.static("build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

mongoose.Promise = Promise
// const mongoUri = 'mongodb://localhost/crosmo-crafts'
const mongoUri = process.env.MONGO_HOST
mongoose?.connect(mongoUri!)
mongoose?.connection.on('error', () => {
  console.log(`unable to connect to database: ${mongoUri}`)
})


const server = http.createServer(app)
const gameServer = new Server({
  server,
})

// register room handlers
gameServer.define(RoomType.LOBBY, LobbyRoom)
gameServer.define(RoomType.PUBLIC, CrosmoRoom, {
  name: 'Public Lobby',
  // description: 'For making friends and familiarizing yourself with the controls',
  // password: null,
  autoDispose: false,
})
// gameServer.define(RoomType.CUSTOM, CrosmoRoom).enableRealtimeListing()

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor())

const port = Number(process.env.PORT || 2567)

gameServer.listen(port)
console.log(`Listening on ws://localhost:${port}`)
