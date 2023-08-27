import fetch from "node-fetch"

import { FOR_RATIO, CLASSNAMES } from "./consts.js"

export const logger = message => {
	console.log(message)
}

export const getLocaleStringTime = () => {
	return new Date().toLocaleString("en-GB", { dateStyle: "short", timeStyle: "medium" })
}

export const getData = node => {
	const nodePriceBYN = node.querySelector(CLASSNAMES.priceBYN)
	const nodePriceUSD = node.querySelector(CLASSNAMES.priceUSD)
	const nodeParameters = node.querySelector(CLASSNAMES.parameters)
	const nodeAddress = node.querySelector(CLASSNAMES.address)
	const nodeDescription = node.querySelector(CLASSNAMES.description)
	const nodeImage = node.querySelector(CLASSNAMES.image)

	const contentPriceBYN = nodePriceBYN?.textContent || ""
	const contentPriceUSD = nodePriceUSD?.textContent || ""
	const contentParameters = nodeParameters?.textContent || ""
	const contentAddress = nodeAddress?.textContent || ""
	const contentDescription = nodeDescription?.textContent || ""
	const contentLink = node?.href || ""
	let contentImage = null

	if (/https:\/\/rms\.kufar\.by.+?\"/g.test(nodeImage?.innerHTML || "")) {
		contentImage = nodeImage.innerHTML
			.match(/https:\/\/rms\.kufar\.by.+?\"/g)[0]
			.replace("\"", "")
	}


	return {
		priceBYN: contentPriceBYN || "",
		priceUSD: contentPriceUSD || "",
		parameters: contentParameters || "",
		address: contentAddress || "",
		description: contentDescription || "",
		link: contentLink || "",
		image: contentImage || ""
	}
}

export const getFormattedData = data => {
	let newPriceBYN = data.priceBYN
	let newPriceUSD = data.priceUSD

	if (/\d+(\d|\s)+\d/g.test(newPriceBYN)) {
		newPriceBYN = newPriceBYN
			.match(/\d+(\d|\s)+\d/g)[0]
			.replace(" ", "")
	}

	if (/\d+(\d|\.)*\d?/gm.test(newPriceUSD)) {
		newPriceUSD = newPriceUSD
			.match(/\d+(\d|\.)*\d?/gm)[0]
			.replace(" ", "")
	}

	return {
		...data,
		priceBYN: `${newPriceBYN} BYN`,
		priceUSD: `${newPriceUSD} USD`,
	}
}

export const generateMessage = ({ data }) => {
	const {
		link,
		address,
		priceBYN,
		priceUSD,
		parameters,
		description
	} = data

	return (
`
<i>price:</i> <b>${priceBYN} / ${priceUSD}</b>

<i>${parameters}</i>
<i>${address}</i>

${description}
`
	)
}


export const generateOptions = ({ data }) => {
	const { link } = data

	return {
		parse_mode: 'HTML',
		reply_markup: JSON.stringify({
			inline_keyboard: [
				[{ text: "Link", url: link }]
			]
    })
	}
}

export const generateData = ({ data }) => {
	const message = generateMessage({ data })
	const options = generateOptions({ data })

	return {
		message,
		options
	}
}

export const sendMeMessage = ({ chatId, bot, message, options = {} }) => {
	const messageToSend = message || EMPTY_MESSAGE
	
	bot.sendMessage(chatId, messageToSend, options);
}

export const sendMeMessageWithImage = ({ chatId, bot, caption, options = {}, image }) => {
	bot.sendPhoto(chatId, image, {
		...options,
		caption
	});
}

export const getKufarDataByPath = async path => {
	return fetch(path)
		.then(data => data.text())
		.then(r => r)
}

export const findObject = (objects, key, value, options) => {
	if (!Array.isArray(objects) || objects.length === 0) return

	return objects.find(object => key in object && object[key] === value)
}

export const getStartDataIndex = ({ domData }) => {
	let startIndex = 0
	for (let i = 0; i < domData.length; i++) {
		const node = domData[i]
		const isHighlighted = Boolean(node.querySelector(CLASSNAMES.highlighted))

		if (!isHighlighted) {
			startIndex = i
			break
		}
	}

	return startIndex
}

export const getLastIndex = ({ domData, savedOffers }) => {
	let lastIndex = 0
	let initialSavedIsEmpty = false

	if (savedOffers.length) {
		lastIndex = domData.length
	} else {
		if (domData.length > lastIndex + FOR_RATIO) {
			lastIndex += FOR_RATIO
		} else {
			lastIndex = domData.length
		}
		
		initialSavedIsEmpty = true
	}

	return  {
		lastIndex,
		initialSavedIsEmpty
	}
}