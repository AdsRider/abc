import { URL } from 'node:url';
import { createPool } from 'slonik';
import { config } from '../config';

const url = new URL('postgres://');

url.hostname = config.database.host;
url.username = config.database.username;
url.password = config.database.password;
url.pathname = config.database.db;
url.port = config.database.port;

export const connect = async () => await createPool(url.toString());
