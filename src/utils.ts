import type TelegramBot from "node-telegram-bot-api";
import { logger } from "./services/logger.ts";

export const getLocaleStringTime = () => {
	return new Date().toLocaleString("en-GB", {
		dateStyle: "short",
		timeStyle: "medium",
	});
};

export const generateMessage = ({
	data,
	changedFields,
}: {
	data: Types.Data;
	changedFields: Types.ChangedData;
}) => {
	const { address, priceBYN, priceUSD, parameters, description, link } = data;

	return `
${changedFields ? "✍️" : "🆕"} <b>${changedFields ? "[EDITED]" : "[NEW]"}</b>

💰 <b>${priceBYN} / ${priceUSD}</b>

<i>⚙️ ${parameters}</i>
<i>📍 ${address}</i>

${description}

${
	changedFields
		? `<pre><code>${getEscaped(JSON.stringify(changedFields, null, "\t"))}</code></pre>`
		: ""
}

<i>🔗 <a href="${link}">Ссылка</a></i>
`;
};

export const generateOptions = ({
	data,
}: {
	data: Types.Data;
}): TelegramBot.SendMediaGroupOptions => {
	const { link } = data;

	return {
		// parse_mode: "HTML",
		// reply_markup: {
		// 	inline_keyboard: [[{ text: "Link", url: link }]],
		// },
	};
};

export const generateMessageData = ({
	data,
	changedFields,
}: {
	data: Types.Data;
	changedFields: Types.ChangedData;
}) => {
	const message = generateMessage({ data, changedFields });
	const options = generateOptions({ data });

	return {
		message,
		options,
	};
};

export const catchError = (error: unknown) => {
	if (error instanceof Error) {
		logger.error(error.message, error.stack);
	} else {
		logger.error(error);
	}
};

export const getEscaped = (json: string) => {
	return json
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
};

export const sleep = (ms:number) => {
	return new Promise(resolve => { setTimeout(() => resolve(true), ms) })
}