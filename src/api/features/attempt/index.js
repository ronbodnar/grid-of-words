import * as attemptController from "./attempt.controller.js";
import * as attemptRepository from "./attempt.repository.js";
import * as attemptRoutes from "./attempt.routes.js";

// Export the imported components so they can be used elsewhere in the application.
// This makes both the controller and repository available for import from this module.
export { attemptController, attemptRepository, attemptRoutes };
