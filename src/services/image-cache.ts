import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export class ImageCacheService {
	private cacheDir = path.resolve("./.cache/images");

	private extractUuid(url: string) {
		const m = url.match(
			/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
		);
		if (!m) throw new Error(`UUID not found in url: ${url}`);
		return m[0];
	}

	async downloadToCache(url: string) {
		const uuid = this.extractUuid(url);
		const destPath = path.join(this.cacheDir, `${uuid}.jpg`);

		await mkdir(this.cacheDir, { recursive: true });

		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(
				`Failed to download ${url}. HTTP ${res.status} ${res.statusText}`,
			);
		}
		if (!res.body) {
			throw new Error(`No response body for ${url}`);
		}

		const nodeStream = Readable.fromWeb(res.body as any);
		await pipeline(nodeStream, createWriteStream(destPath));

		return destPath;
	}

	async clearCache() {
		await rm(this.cacheDir, { recursive: true, force: true });
		return this.cacheDir;
	}
}

export const imageCache = new ImageCacheService();
