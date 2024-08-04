import logger from "../config/winston.config.js";

export const checkAuthentication = (req, res, next) => {
    if (req.session.user) {
        logger.info('User authenticated as', {
            user: req.session.user
        })
        next();
    } else {
        res.end("User not authenticated")
    }
}