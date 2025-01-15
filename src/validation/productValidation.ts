const { check } = require('express-validator');

export const productValidation = [
  check('name').isString().notEmpty().isLength({ min: 1, max: 50 })
    .withMessage('Name should have max 50 characters'),
  check('description').isString().notEmpty().isLength({ min: 1, max: 50 })
    .withMessage('Name should have max 50 characters'),
  check('price').isFloat({ gt: 0 }).exists(),
  check('stock').isInt({ gt: 0 }).exists().withMessage('Stock must be positive'),
];
