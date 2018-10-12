import * as api from './api'
import * as cache from './cache'
import * as logger from './logger'
import { IConfig, IRequest } from './types'

let handle: NodeJS.Timer = null
let options: {
	request: IRequest
	pid: string
	analyticsHost: string
	storeGroup: string
}

export const start = async (config: IConfig) => {
	if (!config.host) {
		throw new Error('Missing host settings')
	}

	const response = await api.check(config.request, config.host, config.key)

	if (response === false) {
		throw new Error('Unable to get project info')
	}

	if (response.analytics.ok !== true) {
		throw new Error(
			`Analytics module is not enabled. ${response.analytics.error}`
		)
	}

	stop()

	options = {
		request: config.request,
		pid: response.pid,
		storeGroup: response.options.storeGroup,
		analyticsHost: response.analytics.host,
	}

	if (config.flushIntervalMillis > 0) {
		handle = setInterval(flushEvents, config.flushIntervalMillis)
	}
}

export const stop = () => {
	if (handle) {
		clearInterval(handle)
		handle = null
		options = null
	}
}

export const flushEvents = () => {
	if (!options) {
		logger.error('SDK not initialized')
		return Promise.resolve(false)
	}

	const events = cache.flush()

	if (events.length === 0) {
		return Promise.resolve(false)
	}

	return api
		.events(
			options.request,
			options.analyticsHost,
			{
				group: options.storeGroup,
				pid: options.pid,
			},
			{
				events,
			}
		)
		.then(result => {
			if (result !== true) {
				logger.error(`Unable to submit ${events.length} events`)
			}
			return events.length
		})
		.catch(err => {
			logger.error(err)
			return false
		})
}
