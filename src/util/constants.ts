import fs from 'fs';
import path from 'path';

// Ads Coin Constants
export const chainId = 11155111;
export const decimal = 18;
export const tokenContractAddress = '0x71b7d7b137cfecf3c8cfce4cf3bba0bbf33c8faf';
export const tokenABI = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../abi.json'), 'utf-8'));
