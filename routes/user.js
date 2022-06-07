const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const { formatExpressValidatorErrors } = require('../services/formValidation');
const Socket = require('../socket');

router.post(
    '/login',
    body('username').isLength({
        min: 3,
        max: 10,
    }).withMessage('Никнейм должен быть больше 3 и меньше 10 символов'),
    (req, res) => {
        const errors = validationResult(req);
        const existsSockets = Socket.getAllSocketsWithData();

        if (!errors.isEmpty()) {
            return res.status(400).json(formatExpressValidatorErrors(errors));
        }

        if (existsSockets.find(socketData => socketData.data.username === req.body.username)) {
            return res.status(400).json(formatExpressValidatorErrors({ array() {
                return [
                    {
                        param: 'username',
                        msg: `Логин ${req.body.username} уже занят!`,
                    }

                ]
            } }))
        }

        return res.send({ success: true });
    }
);

module.exports = router;