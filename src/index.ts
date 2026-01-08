import dotenv from "dotenv";
import { checker } from "@/services/checker.ts";
import { db } from "@/services/db.ts";
import { logger } from "@/services/logger.ts";
import { catchError } from "./utils.ts";

dotenv.config();

db.init()
	.then(() => {
		checker.start();
	})
	.catch((error: unknown) => {
		catchError(error);
		process.exit(1);
	});

process.on("unhandledRejection", (reason) => {
	logger.error("UnhandledRejection:", reason);
	process.exit(1);
});

process.on("uncaughtException", (error) => {
	logger.error("UncaughtException:", error);
	process.exit(1);
});
