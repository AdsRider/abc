import fs from 'node:fs';
import path from 'node:path';
import { Config } from './types/config';

export const config: Config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json'), 'utf-8'));
