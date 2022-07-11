import express from 'express';

import wordRoutes from './word.route.js';
import gameEmitter from '../config/event.config.js';

const router = express.Router();

// Render the index view when visiting the root route
router.get('/', function(req, res) {
    res.render("index", { title: 'Hey' });
});

// Word routes
router.use('/word', wordRoutes);

export default router;