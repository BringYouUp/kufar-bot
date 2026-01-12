import { CLASSNAMES } from "@/consts.ts";
import { logger } from "./logger.ts";

class DataService {
	private getFormattedPrices(data: Pick<Types.Data, "priceBYN" | "priceUSD">) {
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
			priceBYN: `${newPriceBYN || 0} BYN`,
			priceUSD: `${newPriceUSD || 0} USD`,
		};
	}

	getData(node: Element): Types.Data {
		const nodePriceBYN = node.querySelector(CLASSNAMES.priceBYN);
		const nodePriceUSD = node.querySelector(CLASSNAMES.priceUSD);
		const nodeParameters = node.querySelector(CLASSNAMES.parameters);
		const nodeAddress = node.querySelector(CLASSNAMES.address);
		const nodeDescription = node.querySelector(CLASSNAMES.description);
		const nodeImages = node.querySelectorAll(CLASSNAMES.image);

		const { priceBYN, priceUSD } = this.getFormattedPrices({
			priceBYN: nodePriceBYN?.textContent || "",
			priceUSD: nodePriceUSD?.textContent || "",
		});

		const contentParameters = nodeParameters?.textContent || "";
		const contentAddress = nodeAddress?.textContent || "";
		const contentDescription = nodeDescription?.textContent || "";
		const photoUrls: Types.Data["photos"] = [];

		const matched =
			(node as HTMLAnchorElement).href.match(/(.+?(\d+))\?/) || [];
		const [_, link = ""] = matched;

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
						photoUrls.push(imageUrl);
					}
				}

				if (photoUrls.length >= 10) {
					break;
				}
			}
		}

		return {
			priceBYN,
			priceUSD,
			parameters: contentParameters || "",
			address: contentAddress || "",
			description: contentDescription || "",
			photos: photoUrls,
			link,
		};
	}

	isSomeFieldChanged(
		oldData: Types.Data | null,
		actualData: Types.Data,
	): {
		isSomeFieldChanged: boolean;
		changedFields: Types.ChangedData;
	} {
		if (!oldData) {
			return {
				isSomeFieldChanged: false,
				changedFields: null,
			};
		}

		const changedFields: Types.ChangedData = {};
		const keys: (keyof Types.Data)[] = Object.keys(
			actualData,
		) as (keyof Types.Data)[];

		for (const key of keys) {
			// if (oldData._id.toString() === "6960dab8ac8661ec2a1b95ca") {
			// 	if (key === "photos") {
			// 		logger.log("zzzzz", Array.isArray(oldData[key]))
			// 	}
			// }

			if (Array.isArray(oldData[key])) {
				if (JSON.stringify(oldData[key]) !== JSON.stringify(actualData[key])) {
					changedFields[key] = {
						old: oldData[key].length,
						new: actualData[key].length,
					};
					// `${oldData[key].length} => ${actualData[key].length}`;
				}
			} else if (oldData[key] !== actualData[key]) {
				changedFields[key] = {
					old: oldData[key] as string,
					new: actualData[key] as string,
				};
				// changedFields[key] = `${oldData[key]} => ${actualData[key]}`;
			}
		}

		const isSomeFieldChanged = Object.keys(changedFields).length > 0;

		return {
			isSomeFieldChanged,
			changedFields,
		};
	}
}

export const data = new DataService();
