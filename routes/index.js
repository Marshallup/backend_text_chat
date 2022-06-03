const express = require('express');
const router  = express.Router();
const userRoutes = require('./user');

router.use('/user', userRoutes);
router.use('*', (req, res) => {
    return res.status(404).json({
        error: true,
        message: 'Роута не найдено!',
    });
});

module.exports = router;