import TelegramBot from "node-telegram-bot-api";
import { CHAT_ID, TELEGRAM_BOT_TOKEN } from "@/config/env.ts";
import { IMAGES } from "@/consts.ts";
import { logger } from "@/services/logger.ts";
import { catchError, getEscaped } from "@/utils.ts";
import { imageCache } from "./image-cache.ts";

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
		this.bot.on("polling_error", (error: unknown) => {
			logger.error("polling_error:", (error as Error).message || error);
		});

		this.bot.on("message", async (event) => {
			const json = JSON.stringify(event, null, 2);

			await this.sendMessage(
				CHAT_ID,
				`<pre><code>${getEscaped(json)}</code></pre>`,
				{
					parse_mode: "HTML",
				},
			);
		});
	}

	private async sendMessage(
		...params: Parameters<(typeof this.bot)["sendMessage"]>
	) {
		try {
			await this.bot.sendMessage(...params);
		} catch (error: unknown) {
			catchError(error);
			throw error;
		}
	}

	private async sendMediaGroup(
		...params: Parameters<(typeof this.bot)["sendMediaGroup"]>
	) {
		try {
			await this.bot.sendMediaGroup(...params);
		} catch (error: unknown) {
			catchError(error);
			throw error;
		}
	}

	async sendMeMessage(
		message: string,
		photos: string[],
		options: Parameters<(typeof this.bot)["sendMediaGroup"]>[2] = {},
	) {
		const preparedImages = [];

		if (photos.length) {
			for (const photo of photos) {
				const localUrl = await imageCache.downloadToCache(photo);
				preparedImages.push(localUrl);
			}
		} else {
			preparedImages.push(IMAGES.empty);
		}

		await this.sendMediaGroup(
			CHAT_ID,
			preparedImages.map((photo, index) => ({
				media: photo,
				type: "photo",
				caption: index === 0 ? message : undefined,
				parse_mode: "HTML",
			})),
			options,
		);
	}
}

export const bot = TelegramBotService.getInstance();
