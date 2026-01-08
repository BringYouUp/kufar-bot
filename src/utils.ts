import type TelegramBot from "node-telegram-bot-api";
import { MAX_RENTAL_SAVED } from "@/config/env.ts";
import { CLASSNAMES } from "@/consts.ts";
import { logger } from "./services/logger.ts";

export const getLocaleStringTime = () => {
	return new Date().toLocaleString("en-GB", {
		dateStyle: "short",
		timeStyle: "medium",
	});
};

export const findObject = <T extends Record<string, unknown>>(
	objects: T[],
	key: keyof T,
	value: unknown,
) => {
	if (!Array.isArray(objects) || objects.length === 0) return;

	return objects.find((object) => key in object && object[key] === value);
};

export const getData = (node: Element): Types.Data => {
	const nodePriceBYN = node.querySelector(CLASSNAMES.priceBYN);
	const nodePriceUSD = node.querySelector(CLASSNAMES.priceUSD);
	const nodeParameters = node.querySelector(CLASSNAMES.parameters);
	const nodeAddress = node.querySelector(CLASSNAMES.address);
	const nodeDescription = node.querySelector(CLASSNAMES.description);
	const nodeImages = node.querySelectorAll(CLASSNAMES.image);

	const contentPriceBYN = nodePriceBYN?.textContent || "";
	const contentPriceUSD = nodePriceUSD?.textContent || "";
	const contentParameters = nodeParameters?.textContent || "";
	const contentAddress = nodeAddress?.textContent || "";
	const contentDescription = nodeDescription?.textContent || "";
	const contentLink = (node as HTMLAnchorElement).href || "";
	const imageUrls: Types.Data["images"] = [];

	if (nodeImages.length > 0) {
		for (const nodeImage of nodeImages) {
			if (
				nodeImage &&
				/https:\/\/rms\.kufar\.by.+?"/g.test(nodeImage?.innerHTML || "")
			) {
				const imageUrl =
					nodeImage.innerHTML
						.match(/https:\/\/rms\.kufar\.by.+?"/g)?.[0]
						.replace('"', "") || "";

				if (imageUrl) {
					imageUrls.push(imageUrl);
				}
			}

			if (imageUrls.length >= 10) {
				break;
			}
		}
	}

	return {
		priceBYN: contentPriceBYN || "",
		priceUSD: contentPriceUSD || "",
		parameters: contentParameters || "",
		address: contentAddress || "",
		description: contentDescription || "",
		link: contentLink || "",
		images: imageUrls,
	};
};

export const getFormattedData = ({ data }: { data: Types.Data }) => {
	let newPriceBYN = data.priceBYN;
	let newPriceUSD = data.priceUSD;

	if (/\d+(\d|\s)+\d/g.test(newPriceBYN)) {
		newPriceBYN =
			newPriceBYN.match(/\d+(\d|\s)+\d/g)?.[0].replace(" ", "") || "";
	}

	if (/\d+(\d|\.)*\d?/gm.test(newPriceUSD)) {
		newPriceUSD =
			newPriceUSD.match(/\d+(\d|\.)*\d?/gm)?.[0].replace(" ", "") || "";
	}

	return {
		...data,
		priceBYN: `${newPriceBYN} BYN`,
		priceUSD: `${newPriceUSD} USD`,
	};
};

export const generateMessage = ({ data }: { data: Types.Data }) => {
	const { address, priceBYN, priceUSD, parameters, description, link } = data;

	return `
💰 <b>${priceBYN} / ${priceUSD}</b>

<i>⚙️ ${parameters}</i>
<i>📍 ${address}</i>

${description}

<i>🔗 <a href="${link}">Ссылка</a></i>
`;
};

export const generateOptions = ({
	data,
}: {
	data: Types.Data;
}): TelegramBot.SendPhotoOptions => {
	const { link } = data;

	return {
		parse_mode: "HTML",
		reply_markup: {
			inline_keyboard: [[{ text: "Link", url: link }]],
		},
	};
};

export const generateData = ({ data }: { data: Types.Data }) => {
	const message = generateMessage({ data });
	const options = generateOptions({ data });

	return {
		message,
		options,
	};
};

export const getStartDataIndex = ({
	domData,
}: {
	domData: NodeListOf<Element>;
}) => {
	let startIndex = 0;
	for (let i = 0; i < domData.length; i++) {
		const node = domData[i];
		const isHighlighted = Boolean(node.querySelector(CLASSNAMES.highlighted));

		if (!isHighlighted) {
			startIndex = i;
			break;
		}
	}

	return startIndex;
};

export const getLastIndex = ({
	domData,
	savedOffers,
}: {
	domData: NodeListOf<Element>;
	savedOffers: Types.Offer[];
}) => {
	let lastIndex = 0;
	let initialSavedIsEmpty = false;

	if (savedOffers.length) {
		lastIndex = domData.length;
	} else {
		if (domData.length > lastIndex + MAX_RENTAL_SAVED) {
			lastIndex += MAX_RENTAL_SAVED;
		} else {
			lastIndex = domData.length;
		}

		initialSavedIsEmpty = true;
	}

	return {
		lastIndex,
		initialSavedIsEmpty,
	};
};

export const catchError = (error: unknown) => {
	if (error instanceof Error) {
		logger.log(error.message);
	} else {
		logger.log(error);
	}
};
