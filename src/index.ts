import * as cache from './cache'
import * as config from './config'
import * as controller from './controller'
import * as logger from './logger'
import { IConfig, IEvent } from './types'

export const init = (options?: Partial<IConfig>) => {
	const configValues = config.init(options)

	if (!configValues) {
		return false
	}

	logger.init(configValues.logLevel)

	controller
		.start(configValues)
		.then(() => {
			logger.debug('Init successful')
		})
		.catch(err => {
			logger.debug(err)
			logger.error('Init failed')
		})

	return true
}

export const stop = () => {
	return flush().then(() => controller.stop())
}

export const event = (values: IEvent) => {
	cache.add(values)
}

export const flush = () => {
	return controller.flushEvents()
}
