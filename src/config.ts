import * as logger from './logger'
import * as request from './request'
import { IConfig, LogLevel } from './types'

const defaults: IConfig = {
	key: process.env.SMARTLOOK_KEY || null,
	flushIntervalMillis:
		parseInt(process.env.SMARTLOOK_FLUSH_INTERVAL_MILLIS, 10) || 10000,
	host: process.env.SMARTLOOK_HOST || 'manager.smartlook.com',
	request,
	logLevel: (process.env.SMARTLOOK_LOG_LEVEL as LogLevel) || 'error',
	logger,
}

let config: IConfig = null

export const init = (values?: Partial<IConfig>) => {
	config = {
		...defaults,
		...values,
	}

	if (!config.key || !config.key.trim()) {
		logger.error('Missing project key')
		return false
	}

	if (!config.host || !config.host.trim()) {
		logger.error('Missing API hostname')
		return false
	}

	return config
}

export const get = () => {
	if (!config) {
		init()
	}

	return config
}

export const reset = () => {
	config = null
}
