import { JSDOM } from "jsdom";
import { MAX_RENTAL_SAVED } from "@/config/env.ts";
import { CLASSNAMES, ERRORS, IMAGES, KEY_BY_CHECKED } from "@/consts.ts";
import Offer from "@/schemes/offer.ts";
import { bot } from "@/services/bot.ts";
import { interval } from "@/services/interval.ts";
import { logger } from "@/services/logger.ts";
import { offers } from "@/services/offers.ts";
import {
	catchError,
	findObject,
	generateData,
	getData,
	getFormattedData,
	getLastIndex,
	getStartDataIndex,
} from "@/utils.ts";

class DomService {
	async handleKufarData(html: string) {
		try {
			const dom = new JSDOM(html);

			const domData = dom.window.document.querySelectorAll(CLASSNAMES.main);
			if (!domData.length || !domData) {
				logger.log(ERRORS.zero);
				return;
			}

			const startIndex = getStartDataIndex({ domData });
			const { lastIndex, initialSavedIsEmpty } = getLastIndex({
				domData,
				savedOffers: offers.getOffers(),
			});

			for (let i = startIndex; i < lastIndex; i++) {
				if (!initialSavedIsEmpty) {
					if (i > startIndex + MAX_RENTAL_SAVED) {
						break;
					}
				}

				const domContent = domData[i];
				const messageData = getData(domContent);
				const savedTheSame = findObject(
					offers.getOffers(),
					KEY_BY_CHECKED,
					messageData[KEY_BY_CHECKED],
				);
				const isAlreadySavedTheSame = Boolean(savedTheSame);

				if (isAlreadySavedTheSame) {
					break;
				} else {
					const formattedData = getFormattedData({ data: messageData });
					const { message, options } = generateData({ data: formattedData });
					await bot.sendMeMessage(message, formattedData.images, options);
					try {
						const offer = new Offer({ ...formattedData });
						offer.save();
						offers.pushOffer(offer as Types.Offer);
					} catch (error) {
						throw new Error(
							`${ERRORS.saveOffer}. ${(error as Error).message || error}`,
						);
					}
				}
			}
		} catch (error: unknown) {
			catchError(error);
			bot.sendMeMessage(
				logger.getText("error", error instanceof Error ? error.message : error),
				[IMAGES.error],
			);
			interval.clearInterval();
		}
	}
}

export const dom = new DomService();
