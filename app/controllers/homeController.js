const User = require("../models/user.model.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("../models/db.js");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
// Create and Save a new User
var SALT_FACTOR = 5;
exports.register = async (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.role) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  if (req.files.nftImage) {
    var file_path = req.files.nftImage[0].path;
  } else {
    var file_path = '';
  }
  // Create a User
  let password = await bcrypt.hash(req.body.password, 10)
  var user = new User({
    name: req.body.name,
    phone: req.body.phone,
    role: req.body.role,
    email: req.body.email,
    password: password,
    profile: file_path,
    created_at: new Date(),
    updated_at: new Date()
  });
  // Save User in the database
  User.register(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    //else res.send(data);
    else res.status(200).json({
      success: true,
      message: 'Registration successful',
      data: data,
    })
  });
};

// for login api
exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.login(email, password, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred email and password does not exist."
      });
    //else res.send(data);
    else res.status(200).json({
      success: true,
      message: 'Login successful',
      data: data,
    })
  });
};
// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.query.name;
  User.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    else res.send(data);
  });
};
// Find a single User with a id
exports.findOne = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};
// find all published User
exports.findAllPublished = (req, res) => {
  User.getAllPublished((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    else res.send(data);
  });
};
// Update a User identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(req.body);
  User.updateById(
    req.params.id,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};
// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  User.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.id
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};
// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    else res.send({ message: `All Users were deleted successfully!` });
  });
};