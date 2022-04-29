const express = require('express');
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');
const check = require('../middleware/check-auth');
const checkAuth = require('../middleware/check-auth');
const MIME_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const isValid = MIME_TYPES[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    callBack(error, "./backend/images");
  },
  filename: (req, file, callBack) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPES[file.mimetype];
    callBack(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept, auth");
  response.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});
// C:\Users\umar\projects\angular\mean-angular\backend
router.get('/:postId', (request, response, next) => {
  Post.findById({ _id: request.params.postId }).then(result => {
    if (result) {
      response.status(200).json({
        message: "FETCH SINGLE SUCCESS",
        post: result
      });
    } else {
      response.status(404).json({
        error: {
          message: "POST NOT FOUND"
        }
      });
    }
  });
});

router.get('', (request, response, next) => {
  const pageSize = +request.query.pageSize;
  const currentPage = +request.query.currentPage;
  const postQuery = Post.find();
  let posts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      posts = documents;
      return Post.count();
    })
    .then(count => {
      // console.log(posts);
      response.status(200).json({
        message: "SUCCESS",
        posts: posts,
        totalPostCount: count
      });
    })
    .catch(error => {
      response.status(500).json({
        error: {
          message: "Fetching posts failed"
        }
      });
    });
});

router.put('/:postId', checkAuth, multer({ storage: storage }).single('image'), (request, response, next) => {

  let imagePath = request.body.imagePath;
  if (request.file) {
    const url = request.protocol + "://" + request.get("host");
    imagePath = url + "/images/" + request.file.filename;
  }
  const post = new Post({
    _id: request.body.id,
    title: request.body.title,
    content: request.body.content,
    imagePath: imagePath,
    creator: request.userData.userId
  });
  // console.log(post);
  Post.updateOne({ _id: request.params.postId, creator: request.userData.userId }, post).then(result => {
    // console.log(result);
    if (result.n > 0) {
      response.status(200).json({
        message: "UPDATE SUCCESS"
      });
    } else {
      response.status(401).json({
        error: {
          message: "Not authorized  "
        }
      });
    }

  });

});

router.post('', checkAuth, multer({ storage: storage }).single('image'), (request, response, next) => {
  const url = request.protocol + "://" + request.get("host");
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    imagePath: url + "/images/" + request.file.filename,
    creator: request.userData.userId
  });
  console.log(post);
  post.save().then(res => {
    response.status(201).json({
      message: "Added success!!!",
      post: {
        id: res._id,
        ...res
      }
    });
  });

});

router.delete('/:id', checkAuth, (request, response, next) => {
  const id = request.params.id;
  Post.deleteOne({ _id: id, creator: request.userData.userId }).then(result => {
    if (result.n > 0) {
      response.status(200).json({
        message: "deleted"
      });
    } else {
      response.status(401).json({
        error: {
          message: "Not authorized"
        }
      });
    }
  });
});

module.exports = router;