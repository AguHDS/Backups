import dotenv from 'dotenv';
import { vi } from "vitest";

dotenv.config();

declare global {
  var jest: typeof vi;
}

globalThis.jest = vi;