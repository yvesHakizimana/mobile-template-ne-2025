import { Router } from "express";
import { userController } from "./users.controller";
import { authMiddleware } from "../../core/middleware/auth.middleware";

const router = Router()

router.use(authMiddleware)

router.get("/profile", async (req, res, next) => await userController.getUserProfile(req, res, next))

router.patch("/profile", async (req, res, next) => await userController.updateUserProfile(req, res, next))

router.patch("/change-password", async (req, res, next) => await userController.changePassword(req, res, next))

export default router;