import express from 'express';

import wordRoutes from './word.route.js';

const router = express.Router();

// Render the index view when visiting the root route
router.get('/', function(req, res) {
    res.render("index");
});

// Word routes
router.use('/word', wordRoutes);

export default router;