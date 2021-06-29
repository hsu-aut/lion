import { Injectable } from '@nestjs/common';
import * as fs from "fs/promises";

@Injectable()
export class FpbService { 

	private static fpbTempDirectory = "./temp/fpbjs/uploads"

	static getFpbTempDirectory(): string {
		return this.fpbTempDirectory;
	}

	/**
	 * Get all fpb-js files that are currently inside the temp dir
	 * @returns A list of file names
	 */
	async getAllFiles(): Promise<string[]> {
		const fileNames = fs.readdir(FpbService.getFpbTempDirectory());
		return fileNames;
	}

	async deleteAllFiles(): Promise<void> {
		return fs.rmdir(FpbService.getFpbTempDirectory(), { recursive: true });
	}

	/**
	 * Removes whitespaces and slashes from file name in order to get valid IRI
	 * @param fileName file name that might contain problematic characters
	 * @returns A string without spaces and slashes
	 */
	parseFileName(fileName: string): string {
		const newFileName = fileName.replace(/ /g, "_").replace(/\\/g, "_");
		return newFileName;
	}

}
