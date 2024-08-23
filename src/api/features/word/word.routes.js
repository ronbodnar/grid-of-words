import express from "express";
import { handleGetWord, handleGetWordList } from "./word.controller.js";

export const router = express.Router();

router.route("/").get(handleGetWord);
router.route("/list").get(handleGetWordList);
