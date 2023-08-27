import { Schema, model } from "mongoose";

const offer = new Schema({
	priceBYN: String,
	priceUSD: String,
	parameters: String,
	address: String,
	description: String,
	link: String,
	dateTime: String,
	image: String
})

export default model("Offer", offer)