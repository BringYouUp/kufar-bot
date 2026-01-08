import { type InspectOptions, inspect } from "node:util";

type Method = "log" | "success" | "error" | "warn";

class LoggerService {
	private pretty(value: unknown, opts: InspectOptions = {}) {
		return inspect(value, {
			depth: null,
			colors: true,
			compact: false,
			...opts,
		});
	}

	private dic: Record<Method, string> = {
		log: "ℹ️",
		success: "✅",
		error: "❌",
		warn: "⚠️",
	};

	private handleParameters(params: Parameters<(typeof console)["log"]>) {
		return params.map((x) =>
			typeof x === "object" && x !== null ? this.pretty(x) : x,
		);
	}

	log(...data: Parameters<(typeof console)["log"]>) {
		console.log(`${this.dic.log} `, ...this.handleParameters(data));
	}

	success(...data: Parameters<(typeof console)["log"]>) {
		console.log(`${this.dic.success}`, ...this.handleParameters(data));
	}

	error(...data: Parameters<(typeof console)["error"]>) {
		console.error(`${this.dic.error}`, ...this.handleParameters(data));
	}

	warn(...data: Parameters<(typeof console)["warn"]>) {
		console.log(`${this.dic.warn} `, ...this.handleParameters(data));
	}

	getText<T extends Method>(method: T, ...data: unknown[]) {
		return `${this.dic[method]} ${this.handleParameters(data)}`;
	}
}

export const logger = new LoggerService();
