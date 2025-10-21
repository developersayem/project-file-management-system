import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import session from "express-session";
import {errorHandler} from "./middlewares/error.middlewares"
import path from "path";




const app = express();


app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // Reflect the requesting origin
    },
    credentials: true,
  })
);


// set trust proxy
app.set("trust proxy", 1);
// Parse JSON and URL-encoded bodies for routes NOT expecting multipart/form-data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// Parse cookies
app.use(cookieParser());
// Serve files in public folder
app.use("/public", express.static(path.join(process.cwd(), "public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// Use custom logger middleware early
app.use(loggerMiddleware);


// Import routes
import folderRoutes from "./routes/folder.routes"
import fileRoutes from "./routes/file.routes"
import appRoutes from "./routes/app.routes"
import unitPriceRoutes from "./routes/unit.price.routes"


// Use routes
app.use("/api/v1/folders", folderRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/app", appRoutes)
app.use("/api/v1/unit-price", unitPriceRoutes)



// custom error middlewares
app.use(errorHandler)
export { app };
