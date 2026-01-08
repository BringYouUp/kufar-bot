import { CHECK_INTERVAL_MS } from "@/config/env.ts";

class IntervalService {
	private id: ReturnType<typeof setInterval> | null = null;

	private static instance: IntervalService | null = null;

	private constructor() {}

	static getInstance(): IntervalService {
		if (!IntervalService.instance) {
			IntervalService.instance = new IntervalService();
		}
		return IntervalService.instance;
	}

	setInterval(cb: () => void) {
		this.id = setInterval(() => cb(), CHECK_INTERVAL_MS);
	}

	clearInterval() {
		if (this.id) {
			clearInterval(this.id);
		}
	}
}

export const interval = IntervalService.getInstance();
