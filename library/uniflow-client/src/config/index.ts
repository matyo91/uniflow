import { default as convict } from 'convict';
import * as dotenv from 'dotenv';

const activeEnv = process.env.NODE_ENV || 'development';

const envFound = dotenv.config({
  path: `.env.${activeEnv}`,
});
if (!envFound) {
  // Throw generic error
  throw new Error(`Couldn't find .env.${activeEnv} file`);
}

const config = convict({
  port: {
    format: Number,
    default: 8016,
    arg: 'port',
    env: 'PORT',
    doc: 'HTTP port uniflow api can be reached',
  },
});

config.validate({
  allowed: 'strict',
});

export default config;
