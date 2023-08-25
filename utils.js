import { CLASSNAMES } from "./consts.js"

export const getLocaleStringTime = () => {
	return new Date().toLocaleString("en-GB", { dateStyle: "short", timeStyle: "medium" })
}

export const getData = node => {
	const nodePriceBYN = node.querySelector(CLASSNAMES.priceBYN)
	const nodePriceUSD = node.querySelector(CLASSNAMES.priceUSD)
	const nodeParameters = node.querySelector(CLASSNAMES.parameters)
	const nodeAddress = node.querySelector(CLASSNAMES.address)
	const nodeDescription = node.querySelector(CLASSNAMES.descriptoin)

	const contentPriceBYN = nodePriceBYN?.textContent || ""
	const contentPriceUSD = nodePriceUSD?.textContent || ""
	const contentParameters = nodeParameters?.textContent || ""
	const contentAddress = nodeAddress?.textContent || ""
	const contentDescription = nodeDescription?.textContent || ""
	const contentLink = node?.href || ""

	return {
		priceBYN: contentPriceBYN || "",
		priceUSD: contentPriceUSD || "",
		parameters: contentParameters || "",
		address: contentAddress || "",
		description: contentDescription || "",
		link: contentLink || ""
	}
}

export const getFormattedData = data => {
	let newPriceBYN = data.priceBYN
	let newPriceUSD = data.priceUSD

	if (/\d+(\d|\s)+\d/g.test(newPriceBYN)) {
		newPriceBYN = newPriceBYN.match(/\d+(\d|\s)+\d/g)[0].replace(" ", "")
	}

	if (/\d+(\d|\.)*\d?/gm.test(newPriceUSD)) {
		newPriceUSD = newPriceUSD.match(/\d+(\d|\.)*\d?/gm)[0].replace(" ", "")
	}

	return {
		...data,
		priceBYN: `${newPriceBYN} BYN`,
		priceUSD: `${newPriceUSD} USD`
	}
}

export const generateMessage = ({ data }) => {
	const {
		priceBYN,
		priceUSD,
		address,
		link
	} = data

	return (
`
<i>price:</i> <b>${priceBYN} / ${priceUSD}</b>

<i>${address}</i>

<i>${getLocaleStringTime()}</i>
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