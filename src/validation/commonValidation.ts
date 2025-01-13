const { check } = require('express-validator');

export const uidValidation = [
  check('id').isUUID().notEmpty().withMessage('Invalid uid'),
];
