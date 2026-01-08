import mongoose from "mongoose";
import { MONGO_DB_URL } from "@/config/env.ts";
import { MESSAGES } from "@/consts.ts";
import Offer from "@/schemes/offer.ts";
import { logger } from "@/services/logger.ts";
import { offers } from "@/services/offers.ts";

class DbService {
	private static instance: DbService | null = null;

	private constructor() {}

	static getInstance(): DbService {
		if (!DbService.instance) {
			DbService.instance = new DbService();
		}
		return DbService.instance;
	}

	private async connect() {
		await mongoose.connect(MONGO_DB_URL);
	}

	init() {
		return new Promise((resolve, reject) => {
			this.connect()
				.then(() => Offer.find())
				.then((offersData) => {
					if (Array.isArray(offersData) && offersData.length > 0) {
						offers.setOffers(offersData);
					}
					logger.success(MESSAGES.dbConnected);
					resolve(true);
				})
				.catch((error) => reject(error));
		});
	}
}

export const db = DbService.getInstance();
