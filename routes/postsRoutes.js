const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const post_SERVICE = 'postService';

// Lista de todos los posts
router.get('/', asyncHandler(async (req, res) => {
  res.send(await res.app.get(post_SERVICE).getAll());
}));


// Detalle de un post
router.get('/:id', asyncHandler(async (req, res) => {
  const response = await res.app.get(post_SERVICE).getById(req.params.id);
  if (response) {
    res.send(response);
  } else {
    res.sendStatus(404);
  }
}));

// Crear un post
router.post('/', asyncHandler(async (req, res) => {
  res.status(201).send(await res.app.get(post_SERVICE).save(req.body));
}));

// Modificar un post
router.put('/:id', asyncHandler(async (req, res) => {
  const response = await res.app.get(post_SERVICE).update(req.params.id, req.body);
  if (response) {
    res.status(200).send(response);
  } else {
    res.sendStatus(404);
  }
}));

// Eliminar un post
router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await res.app.get(post_SERVICE).deleteById(req.params.id);
  res.status(deleted.count == 1 ? 204 : 404).end();
}));

module.exports = router;