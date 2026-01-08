import TelegramBot from "node-telegram-bot-api";
import { TELEGRAM_BOT_TOKEN, CHAT_ID } from "@/config/env.ts";
import { logger } from "@/services/logger.ts";
import { IMAGES } from "@/consts.ts";

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
      console.error("polling_error:", err.message);
    });
  }

  private async sendMessage(...params: Parameters<(typeof this.bot)['sendMessage']>) {
    await this.bot.sendMessage(...params)
  }

  private async sendMediaGroup(...params: Parameters<(typeof this.bot)['sendMediaGroup']>) {
    await this.bot.sendMediaGroup(...params)
  }

  async sendMeMessage(message: string, photos: string[], options: Parameters<(typeof this.bot)['sendMediaGroup']>[2] = {}) {
    try {
      await this.sendMediaGroup(CHAT_ID, (photos.length ? photos : [IMAGES.empty]).map(photo => ({
        media: photo, type: 'photo', caption: message, parse_mode: "HTML",
      })), options);
    } catch (error: any) {
      logger.error(error?.message || error)
    }
  }
}

export const bot = TelegramBotService.getInstance()
