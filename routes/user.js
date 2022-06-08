const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const { formatExpressValidatorErrors } = require('../services/formValidation');
const UserService = require('../services/user');

router.post(
    '/login',
    body('username').isLength({
        min: 3,
        max: 10,
    }).withMessage('Никнейм должен быть больше 3 и меньше 10 символов'),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(formatExpressValidatorErrors(errors));
        }

        try {
            UserService.checkSocket(req.body.username);
        } catch(error) {
            return res.status(400).json(error);
        }

        return res.send({ success: true });
    }
);

module.exports = router;