const { check } = require('express-validator');

export const orderValidation = [
  check('customerId').isString().notEmpty(),
  check('products').isArray().withMessage('The products must be an array.')
    .custom((value: string[]) => value.every((item: string) => typeof item === 'string'))
    .withMessage('Each product must be a string.'),
];
