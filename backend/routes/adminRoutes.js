import express from "express";

import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

import {
    getStats,
    getUsers,
    getReviews,
    getComments,
    deleteReview,
    deleteComment
} from "../controllers/adminController.js";

const router = express.Router();

router.use(auth, admin);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/reviews", getReviews);
router.get("/comments", getComments);

router.delete("/reviews/:id", deleteReview);
router.delete("/comments/:id", deleteComment);

export default router;