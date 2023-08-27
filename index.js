import fetch from "node-fetch"
import { JSDOM  } from "jsdom";
import TelegramBot from "node-telegram-bot-api"
import dotenv from "dotenv"
import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from "mongodb";
import Offer from "./schemes/offer.js"

import {
	logger,
	getData,
	findObject,
	generateData,
	getLastIndex,
	sendMeMessage,
	getFormattedData,
	getStartDataIndex,
	getKufarDataByPath,
	getLocaleStringTime,
	sendMeMessageWithImage
} from "./utils.js"

import {
	MS,
	ERRORS,
	MESSAGES,
	FOR_RATIO,
	CLASSNAMES,
	PATH_FLATS,
	KEY_BY_CHECHED,
	INTERVAL_DELAY_S, 
	RESULTS_PER_PAGE,
} from "./consts.js"

dotenv.config()

const BOT_TOKEN = process.env.BOT_TOKEN;
const MY_CHAT_ID = process.env.MY_CHAT_ID
const MONGO_DB_URL = process.env.MONGO_DB_URL

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

let interval = null
let savedOffers = []

const sendMeMessageWrap = ({ message, options, data = {} }) => {
	if (!data.image) {
		sendMeMessage({
			bot,
			message,
			options,
			chatId: MY_CHAT_ID
		})
	} else {
		sendMeMessageWithImage({
			bot,
			image: data.image,
			caption: message,
			options,
			chatId: MY_CHAT_ID
		})
	}
}

const handleKufarData = data => {
	try {
		const dom = new JSDOM(data)

		const domData = dom.window.document.querySelectorAll(CLASSNAMES.main)
		if (!domData.length || !domData) {
			logger(ERRORS.zero)
			return
		}

		const startIndex = getStartDataIndex({ domData })
		const { lastIndex, initialSavedIsEmpty } = getLastIndex({ domData, savedOffers })

		for (let i = startIndex; i < lastIndex; i++) {
			if (!initialSavedIsEmpty) {
				if (i > startIndex + FOR_RATIO) {
					break
				}
			}

			const domContent = domData[i]
			const messageData = getData(domContent)
			const savedTheSame = findObject(savedOffers, KEY_BY_CHECHED, messageData[KEY_BY_CHECHED])
			const isAlreadySavedTheSame = Boolean(savedTheSame)

			if (isAlreadySavedTheSame) {
				break
			} else {
				const formattedData = getFormattedData(messageData)
				const { message, options } = generateData({ data: formattedData })
				sendMeMessageWrap({ message, options, data: formattedData })
				try {
					const offer = new Offer({ ...formattedData })
					offer.save()
					savedOffers.push(offer)
				} catch (e) {
					throw new Error(`${ERRORS.saveOffer}. ${e.message}`)
				}
			}
		}
	} catch (e) {
		// debugger
		sendMeMessageWrap({ message: e.message || e })
		if (interval) {
			clearInterval(interval)
		}
	}
}

const check = () => {
	logger(`${MESSAGES.check} ${getLocaleStringTime()}`)
	getKufarDataByPath(PATH_FLATS)
		.then(data => handleKufarData(data))
		.catch(e => {
			sendMeMessageWrap({ message: `STOPPED - ${e.message || e}` })
			clearInterval(interval)
	})
}

const start = () => {
	check()
	interval = setInterval(() => check(), INTERVAL_DELAY_S * MS)
}

async function main() {
  await mongoose.connect(MONGO_DB_URL);
}

main()
	.then(() => Offer.find())
	.then((offersData) => {
		if (Array.isArray(offersData) && offersData.length > 0) {
			savedOffers = offersData
		}
		logger(MESSAGES.dbConnected)
		start()
	})
	.catch(e => {
		sendMeMessageWrap({ message: `${ERRORS.initMongo}. ${e.message}` })
	});