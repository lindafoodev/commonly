'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const mongoose = require('mongoose');

const { Item } = require('./model');
const router = express.Router();

mongoose.Promise = global.Promise;

let items; 

router.get('/', (req, res, next) => {
  Item.find()
    .then(list => {
      res.json(list);
    })
    .catch(next);
});

``
// router.get('/:id', (req, res, next) => {
//   const id = req.params.id;

//   items.findByIdAsync(id)
//     .then(item => {
//       if (item) {
//         res.json(item);
//       } else {
//         next(); // 404 handler
//       }
//     })
//     .catch(next);  // error handler
// });

// router.post('/', (req, res, next) => {
//   const { name, checked } = req.body;

//   /***** Never trust users - validate input *****/
//   if (!name) {
//     const err = new Error('Missing `name` in request body');
//     err.status = 400;
//     return next(err); // error handler
//   }
//   const newItem = { name, checked };

//   // create
//   items.createAsync(newItem)
//     .then(item => {
//       if (item) {
//         res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item);
//       } else {
//         next(); // 404 handler
//       }
//     })
//     .catch(next);  // error handler
// });

// router.put('/:id', (req, res, next) => {
//   const id = req.params.id;

//   /***** Never trust users - validate input *****/
//   const replaceItem = {};
//   const updateableFields = ['name', 'checked'];

//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       replaceItem[field] = req.body[field];
//     }
//   });

//   /***** Never trust users - validate input *****/
//   if (!replaceItem.name) {
//     const err = new Error('Missing `name` in request body');
//     err.status = 400;
//     return next(err); // error handler
//   }

//   // replace
//   items.findByIdAndReplaceAsync(id, replaceItem)
//     .then(item => {
//       if (item) {
//         res.json(item);
//       } else {
//         next(); // 404 handler
//       }
//     })
//     .catch(next); // error handler
// });

// router.patch('/:id', (req, res, next) => {
//   const id = req.params.id;

//   /***** Never trust users - validate input *****/
//   const replaceItem = {};
//   const updateableFields = ['name', 'checked'];
  
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       replaceItem[field] = req.body[field];
//     }
//   });

//   // update
//   items.findByIdAndUpdateAsync(id, replaceItem)
//     .then(item => {
//       if (item) {
//         res.json(item);
//       } else {
//         next(); // 404 handler
//       }
//     })
//     .catch(next); // error handler
// });

// router.delete('/:id', (req, res, next) => {
//   const id = req.params.id;

//   items.findByIdAndRemoveAsync(id)
//     .then(count => {
//       if (count) {
//         res.status(204).end();
//       } else {
//         next(); // 404 handler
//       }
//     })
//     .catch(next); // error handler
// });



module.exports = router;