import dotenv from "dotenv"

import { logger } from "@/services/logger.ts";
import { db } from "@/services/db.ts";
import { checker } from "@/services/checker.ts";

dotenv.config()

db.init()
	.then(() => {
		checker.start()
	})
	.catch((error: any) => {
		logger.error(error);
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
