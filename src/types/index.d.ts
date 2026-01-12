declare namespace Types {
	export type Offer = {
		priceBYN: string;
		priceUSD: string;
		parameters: string;
		address: string;
		description: string;
		link: string;
		photos: string[];
	};

	export type Data = Offer;

	// export type ChangedData =Partial<Record<keyof Types.Data, string>> | null
	export type ChangedData = Partial<Record<keyof Types.Data, {
		old: string | number,
		new: string | number
	}>> | null

	export namespace Env {
		export type Key =
			| "TELEGRAM_BOT_TOKEN"
			| "CHAT_ID"
			| "MONGO_DB_URL"
			| "KUFAR_URL"
			| "CHECK_INTERVAL_MS"
			| "MAX_RENTAL_SAVED";
	}
}
