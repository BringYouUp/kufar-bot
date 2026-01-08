import { env } from "@/services/env.ts";

export const TELEGRAM_BOT_TOKEN = env.variables.TELEGRAM_BOT_TOKEN
export const KUFAR_URL = env.variables.KUFAR_URL
export const MONGO_DB_URL = env.variables.MONGO_DB_URL
export const CHAT_ID = env.variables.CHAT_ID
export const INTERVAL_DELAY_MS = Number(env.variables.INTERVAL_DELAY_MS)
export const MAX_RENTAL_SAVED = Number(env.variables.MAX_RENTAL_SAVED)