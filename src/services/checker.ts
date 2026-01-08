import { IMAGES, MESSAGES } from "@/consts.ts";
import { bot } from "@/services/bot.ts";
import { dom } from "@/services/dom.ts";
import { interval } from "@/services/interval.ts";
import { logger } from "@/services/logger.ts";
import { request } from "@/services/request.ts";
import { getLocaleStringTime } from "@/utils.ts";

class CheckerService {
	private static instance: CheckerService | null = null;

	private constructor() {}

	static getInstance(): CheckerService {
		if (!CheckerService.instance) {
			CheckerService.instance = new CheckerService();
		}
		return CheckerService.instance;
	}

	private check() {
		logger.log(`${MESSAGES.check} ${getLocaleStringTime()}`);
		request
			.getKufarDataByPath()
			.then((html) => dom.handleKufarData(html))
			.catch((error) => {
				bot.sendMeMessage(logger.getText("error", error.message || error), [
					IMAGES.error,
				]);
			});
	}

	start() {
		this.check();
		interval.setInterval(() => this.check());
	}
}

export const checker = CheckerService.getInstance();
