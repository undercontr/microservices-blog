const express = require("express");
const axios = require("axios");
const { randomBytes } = require("crypto")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express();

const posts = {};

app.use(bodyParser.json());
app.use(cors())

app.get("/posts", (req, res) => {
    res.send(posts)
})

app.post("/posts", async (req, res) => {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;

    posts[id] = {
        id, title
    }

    await axios.post("http://localhost:4005/events", {
        type: "PostCreated", data: {
            id, title
        }
    })

    res.status(201).send(posts[id])
})

app.post("/events", (req, res) => {
    res.send({})
})

app.listen(4000, () => {
    console.log("Listening on 4000 on kube test 123")
})