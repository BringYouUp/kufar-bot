class OffersService {
	private static instance: OffersService | null = null;
	private offers: Types.Offer[] = [];

	static getInstance(): OffersService {
		if (!OffersService.instance) {
			OffersService.instance = new OffersService();
		}
		return OffersService.instance;
	}

	setOffers(offers: Types.Offer[]) {
		this.offers = offers;
	}

	getOffers() {
		return this.offers;
	}

	pushOffer(offer: Types.Offer) {
		this.offers.push(offer);
	}
}

export const offers = OffersService.getInstance();
