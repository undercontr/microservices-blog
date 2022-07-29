import React from "react";

const CommentList = ({ comments }) => {

  const renderedComments = comments.map((comment) => {
    let content = comment.content;
    if (comment.status === "rejected") {
      content = "This comment is rejected"
    }

    if (comment.status === "pending") {
      content = "This comment is awating for moderation"
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
