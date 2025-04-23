import { Router } from "express";
import { authMiddleware } from "../../core/middleware/auth.middleware";
import { validateRequest } from "../../core/middleware/validation.middleware";
import { createTodoSchema, idSchema, updateTodoSchema } from "./dtos.schema";
import { todoController } from "./todos.controller";
import { table } from "console";

const router = Router()

router.use(authMiddleware)

router.get("/", async (req, res, next) => await todoController.getAllTodos(req, res, next))

router.get("/:id",  validateRequest(idSchema, {target: 'params'}), async (req, res, next) => await todoController.getTodoById(req, res, next))

router.post("/", validateRequest(createTodoSchema), async (req, res, next) => await todoController.createTodo(req, res, next))

router.patch("/:id", validateRequest(idSchema, {target: "params"}),  validateRequest(updateTodoSchema),  async (req, res, next) => await todoController.updateTodo(req, res, next))

router.delete("/:id", validateRequest(idSchema, {target: "params"}), async (req, res, next) => await todoController.deleteTodo(req, res, next))


export default router;