import { JSDOM } from "jsdom";
import { MAX_RENTAL_SAVED } from "@/config/env.ts";
import { CLASSNAMES, ERRORS, IMAGES } from "@/consts.ts";
import { bot } from "@/services/bot.ts";
import { logger } from "@/services/logger.ts";
import { offers } from "@/services/offers.ts";
import { catchError, generateMessageData, sleep } from "@/utils.ts";
import { data } from "./data.ts";
import { imageCache } from "./image-cache.ts";

class DomService {
	async handleKufarData(html: string) {
		try {
			const dom = new JSDOM(html);

			const domData = dom.window.document.querySelectorAll(CLASSNAMES.main);
			if (!domData.length || !domData) {
				logger.log(ERRORS.zero);
				return;
			}

			for (let i = 0; i < MAX_RENTAL_SAVED; i++) {
				const domContent = domData[i];
				const messageData = data.getData(domContent);
				const savedTheSame = await offers.findOneOffer(messageData.link);

				const { isSomeFieldChanged, changedFields } = data.isSomeFieldChanged(
					savedTheSame,
					messageData,
				);

				if (savedTheSame && !isSomeFieldChanged) {
					continue;
				}

				const { message, options } = generateMessageData({
					data: messageData,
					changedFields: isSomeFieldChanged ? changedFields : null,
				});

				try {
					bot.sendMeMessage(message, messageData.photos, options)
					logger.success("Sent -", messageData.address, messageData.link);

					if (!savedTheSame) {
						await offers.saveOffer(messageData);
					} else {
						await offers.updateOne(savedTheSame._id.toString(), messageData);
					}

					await sleep(3000)
				} catch (error: unknown) {
					logger.error(
						"Sending error -",
						messageData.address,
						messageData.link,
					);
				}
			}

			await imageCache.clearCache();
		} catch (error: unknown) {
			catchError(error);
			bot.sendMeMessage(
				logger.getText("error", error instanceof Error ? error.message : error),
				[IMAGES.error],
			);
		}
	}
}

export const dom = new DomService();
