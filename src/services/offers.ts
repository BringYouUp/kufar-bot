import Offer from "@/schemes/offer.ts";
import { logger } from "./logger.ts";

class OffersService {
	async saveOffer(data: Types.Offer) {
		const offer = new Offer(data);

		return await offer.save();
	}

	async findOneOffer(link: string) {
		return await Offer.findOne({ link });
	}

	async updateOne(_id: string, data: Types.Data) {
		const updated = await Offer.updateOne(
			{
				_id,
			},
			data,
		);

		// logger.success("Updated with _id", _id)
		return updated;
	}
}

export const offers = new OffersService();
