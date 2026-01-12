import { CHECK_INTERVAL_MS } from "@/config/env.ts";

class IntervalService {
	private id: ReturnType<typeof setTimeout> | null = null;

	private static instance: IntervalService | null = null;

	private constructor() {}

	static getInstance(): IntervalService {
		if (!IntervalService.instance) {
			IntervalService.instance = new IntervalService();
		}
		return IntervalService.instance;
	}

	clearId() {
		if (this.id) {
			clearTimeout(this.id);
		}
	}

	checkWithInterval(cb: () => unknown) {
		this.clearId()

		this.id = setTimeout(() => cb(), CHECK_INTERVAL_MS)
	}
}

export const interval = IntervalService.getInstance();
