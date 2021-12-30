const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();
module.exports = {
  //registrar usuario
  async create(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.create({
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
      });

      return res.json(user);
    } catch (err) {
      return res.status(400).send("Usuario já cadastrado");
    }
  },

  async authentication(req, res) {
    //faz a autenticação
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) res.status(400);
      const passwordMatch = bcrypt.compareSync(String(password), user.password);
      if (!passwordMatch) res.status(400);

      return res.json({ message: "logado, bem-vindo senhor: " + user.name });
    } catch (error) {
      return res.json({ error: error.message });
    }
  },

  async busca(req, res) {
    User.findById(req.params.id, function (err, user) {
      if (err) res.send(err);
      // retorna o usuário desejado.
      return res.json(user);
    });
  },

  async showall(req, res) {
    const users = await User.find();
    return res.json(users);
  },
};
