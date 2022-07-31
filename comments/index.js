const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
const { randomBytes } = require("crypto");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    const comments = commentsByPostId[req.params.id] || []
    res.send(comments)
})

app.post("/posts/:id/comments", async (req, res) => {
    const commentId = randomBytes(4).toString("hex");
    const postId = req.params.id;
    const {content} = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({id: commentId, content, status: "pending"});

    commentsByPostId[req.params.id] = comments; 

    await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentCreated",
        data: {
            id: commentId, 
            content, 
            postId,
            status: "pending", 
        }
    })

    res.status(201).send(comments);
})

app.post("/events", async (req, res) => {
    const {type, data} = req.body;
    console.log("Event Received: " + type)

    if (type == "CommentModerated") {
        const {id, postId, content, status} = data;
        const comments = commentsByPostId[postId]
        
        const comment = comments.find((comm) => comm.id == id);
        comment.status = status;

        await axios.post("http://event-bus-srv:4005/events", {
            type: "CommentUpdated",
            data: {id, content, postId, status}
        })
    }
    res.send({})
})

app.listen(4001, () => {
    console.log("Listening on 4001")
})
