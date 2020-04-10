const express = require("express");
const posts = require("../data/db");

const router = express.Router();

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  posts
    .insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

router.post("/:id/comments", (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({
      message: "The post with the specified ID does not exist.",
    });
  }

  if (!req.body.text) {
    return res.status(400).json({
      errorMessage: "Please provide text for the comment.",
    });
  }
  
  console.log(req.body)
  posts
    .insertComment(req.body)
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      });
    });
});

router.get("/", (req, res) => {
  posts.find()
    .then((posts) => {
      res.status(200).json(posts)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        error: "The posts information could not be retrieved."
      })
    })
})

router.get('/:id', (req, res) => {
  posts.findById(req.params.id)
      .then((post) => {
          console.log(post);
          if (post.length === 0) {
              res.status(404).json({
                  message: 'The post with the specified ID does not exist.',
              })
          } else {
              res.status(200).json(post)
          }
      })
      .catch((err) => {
          console.log(err)
          return res.status(500).json({
              error: 'The post information could not be retrieved.'
          })
      });
})


router.get("/:id/comments", (req, res) => {
  posts.findPostComments(req.params.id)
    .then((comments) => {
      if (comments.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        })
      } else {
        res.json(comments)
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        error: "The comments information could not be retrieved."
      })
    })
})

router.delete("/:id", (req, res) => {
  posts.remove(req.params.id)
    .then((post) => {
      if (post === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        })
      } else {
        res.status(200).json({
          message: "Post  successfully deleted"
        })
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "Error removing post"
      })
    })
})

router.put("/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    })
  }

  posts.update(req.params.id, req.body)
    .then((post) => {
      if (post === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        })
      } else {
        res.status(200).json(post)
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        error: "The post information could not be modified."
      })
    })
})

module.exports = router;
