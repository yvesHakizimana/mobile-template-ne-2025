import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { stream } from "./core/config/logger";
import { errorMiddleware } from "./core/middleware/error.middleware";
import { ApiResponse } from "./core/utils/api-response.util";
import authRoutes from "./modules/auth/auth.routes";
import todoRoutes from "./modules/todos/todos.routes";
import userRoutes from "./modules/users/users.routes";
 
const app = express();

// Middlewares
app.use(morgan("combined", {stream}))
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/todos", todoRoutes)


// Health Check route.
app.get("/health", (req, res) => {
    return ApiResponse.success(res, "Every thing is OK.")
})

// Error Middleware.
app.use(errorMiddleware)

export default app;