import { KUFAR_URL } from "@/config/env.ts";

class RequestService {
	async getKufarDataByPath() {
		const data = await fetch(KUFAR_URL);
		return await data.text();
	}
}

export const request = new RequestService();
