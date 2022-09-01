import express from "express";
import { handleGetSessionData } from "./session.controller.js";

export const router = express.Router();

router.route("/").get(handleGetSessionData);