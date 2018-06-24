const env = process.env.NODE_ENV || 'development';

if ((env === 'development') || (env === 'test')) {
  const config = require('./config.json')
  const configEnv = config[env]

  for (const key of Object.keys(configEnv)) {
    process.env[key] = configEnv[key]
  }
}
