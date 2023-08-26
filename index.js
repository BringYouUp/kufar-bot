import fetch from "node-fetch"
import { JSDOM  } from "jsdom";
import TelegramBot from "node-telegram-bot-api"
import dotenv from "dotenv"

import {
	getData,
	generateOptions,
	generateMessage,
	getFormattedData,
	getLocaleStringTime
} from "./utils.js"

import {
	MS,
	CLASSNAMES,
	PATH_ROOMS,
	PATH_FLATS,
	ERROR_ZERO,
	EMPTY_MESSAGE,
	CACHE_KEY_ROOM,
	CACHE_KEY_FLAT,
	INTERVAL_DELAY_S, 
	DEFAULT_CACHE_SCHEMA
} from "./consts.js"

dotenv.config()

const BOT_TOKEN = process.env.BOT_TOKEN;
const MY_CHAT_ID = process.env.MY_CHAT_ID
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

let cached = DEFAULT_CACHE_SCHEMA
let interval = null

const handleKufarData = (data, key) => {
	try {
		const dom = new JSDOM(data)

		const domData = dom.window.document.querySelectorAll(CLASSNAMES.main)
		if (!domData.length || !domData) {
			sendMeMessage(`${ERROR_ZERO}`)
			return
		}

		const domDataIndex = domData.length >= 30 ?  domData.length % 30 : 0
		const domContent = domData[domDataIndex]
		const messageData = getData(domContent)

		if (cached[key]) {
			if (cached[key] !== messageData.description && messageData.description) {
				const formattedData = getFormattedData(messageData)
				const message = generateMessage({data: formattedData })
				const options = generateOptions({data: formattedData })
				sendMeMessage({ message, options })

				cached[key] = messageData.description
			}
		} else {
			cached[key] = messageData.description
		}
	} catch (e) {
		debugger
		sendMeMessage({ message: e.message || e })
		// clearInterval(interval)
	}
}

const getKufarDataByPath = async path => {
	return fetch(path)
		.then(data => data.text())
		.then(r => r)
		.catch(e => {
			sendMeMessage({ message: `STOPPED - ${e.message || e}` })
			clearInterval(interval)
	})
}

function sendMeMessage ({ message, options = {} }) {
	const messageToSend = message || EMPTY_MESSAGE
	
	bot.sendMessage(MY_CHAT_ID, messageToSend, options);
}


function check () {
	console.log(`→ check`, getLocaleStringTime())
	getKufarDataByPath(PATH_ROOMS).then(data => handleKufarData(data, CACHE_KEY_ROOM))
	getKufarDataByPath(PATH_FLATS).then(data => handleKufarData(data, CACHE_KEY_FLAT))
}

function start() {
	check()
	interval = setInterval(() => check(), INTERVAL_DELAY_S * MS)
}

start()