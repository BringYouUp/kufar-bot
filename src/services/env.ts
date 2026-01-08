import { logger } from "@/services/logger.ts";

class EnvService {
	variables: Record<Types.Env.Key, string> = {
		TELEGRAM_BOT_TOKEN: "",
		KUFAR_URL: "",
		MONGO_DB_URL: "",
		CHAT_ID: "",
		CHECK_INTERVAL_MS: "",
		MAX_RENTAL_SAVED: "",
	};

	constructor() {
		this.setRequired("TELEGRAM_BOT_TOKEN");
		this.setRequired("CHAT_ID");
		this.setRequired("MONGO_DB_URL");
		this.setRequired("KUFAR_URL");
		this.setRequired("CHECK_INTERVAL_MS");
		this.setRequired("MAX_RENTAL_SAVED");
	}

	setRequired(name: Types.Env.Key) {
		const value = process.env[name];
		if (!value) {
			logger.error(`Missing env var: ${name}`);
			process.exitCode = 1;
			process.exit();
		}

		this.variables[name] = value;
	}
}

export const env = new EnvService();
