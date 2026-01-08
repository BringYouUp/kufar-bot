import { Schema, model } from "mongoose";

const offer = new Schema<Types.Offer>({
	priceBYN: String,
	priceUSD: String,
	parameters: String,
	address: String,
	description: String,
	link: String,
	dateTime: String,
	images: { type: [String], default: [] },
}, {
	timestamps: true
})

export default model("Offer", offer)