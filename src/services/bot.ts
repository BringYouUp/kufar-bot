import TelegramBot from "node-telegram-bot-api";
import { CHAT_ID, TELEGRAM_BOT_TOKEN } from "@/config/env.ts";
import { IMAGES } from "@/consts.ts";
import { logger } from "@/services/logger.ts";
import { catchError } from "@/utils.ts";

class TelegramBotService {
	private static instance: TelegramBotService | null = null;
	private bot: TelegramBot;

	private constructor() {
		this.bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
		this.registerBaseHandlers();
	}

	static getInstance(): TelegramBotService {
		if (!TelegramBotService.instance) {
			TelegramBotService.instance = new TelegramBotService();
		}
		return TelegramBotService.instance;
	}

	getBot(): TelegramBot {
		return this.bot;
	}

	private registerBaseHandlers() {
		this.bot.on("polling_error", (err) => {
			logger.error("polling_error:", err.message);
		});

		this.bot.on("message", async (e) => {
			const json = JSON.stringify(e, null, 2);
			const escaped = json
				.replaceAll("&", "&amp;")
				.replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;");

			await this.sendMessage(CHAT_ID, `<pre><code>${escaped}</code></pre>`, {
				parse_mode: "HTML",
			});
		});
	}

	private async sendMessage(
		...params: Parameters<(typeof this.bot)["sendMessage"]>
	) {
		try {
			await this.bot.sendMessage(...params);
		} catch (error: unknown) {
			catchError(error);
		}
	}

	private async sendMediaGroup(
		...params: Parameters<(typeof this.bot)["sendMediaGroup"]>
	) {
		try {
			await this.bot.sendMediaGroup(...params);
		} catch (error: unknown) {
			catchError(error);
		}
	}

	async sendMeMessage(
		message: string,
		photos: string[],
		options: Parameters<(typeof this.bot)["sendMediaGroup"]>[2] = {},
	) {
		await this.sendMediaGroup(
			CHAT_ID,
			(photos.length ? photos : [IMAGES.empty]).map((photo) => ({
				media: photo,
				type: "photo",
				caption: message,
				parse_mode: "HTML",
			})),
			options,
		);
	}
}

export const bot = TelegramBotService.getInstance();
