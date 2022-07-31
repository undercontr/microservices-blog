const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {}

app.get("/posts", (req, res) => {
    res.send(posts)
})

app.post("/events", (req, res) => {
    const {type, data} = req.body
    console.log("Event Received: " + type)
    handleEvent(type, data);
})

app.listen(4002, async () => {
    console.log("Listening on 4002")

    try {
        const {data: events} = await axios.get("http://event-bus-srv:4005/events")

        events.forEach(({type, data}) => {
            handleEvent(type, data)
        })

    } catch (err) {
        console.error(err.message)
    }
})

const handleEvent = (type, data) => {
    if (type === "PostCreated") {
        const {id, title} = data;
        posts[id] = {id, title, comments: []}
    }

    if (type === "CommentCreated") {
        const {id, content, postId, status} = data
        const post = posts[postId];
        post.comments.push({id, content, status})

    }

    if (type == "CommentUpdated") {
        const {id, content, postId, status} = data
        const post = posts[postId]
        console.log("CommentUpdated", posts, data)
        const comment = post.comments.find((comment) => comment.id == id);
        comment.content = content;
        comment.status = status;
    }
}