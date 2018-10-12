import * as logger from './logger'
import { ICheckResponse, IEvent, IEventsQuery, IRequest } from './types'

export const CHECK_PATH = '/rec/check/backend'
export const EVENTS_PATH = '/events/backend'

export const check = async (
	request: IRequest,
	hostname: string,
	key: string
) => {
	try {
		logger.trace({ key }, 'Check request data')
		const payload = JSON.stringify({ key })
		return await request.post<ICheckResponse>({
			hostname,
			path: CHECK_PATH,
			data: payload,
		})
	} catch (err) {
		return false
	}
}

export const events = async (
	request: IRequest,
	hostname: string,
	query: IEventsQuery,
	data: { events: IEvent[] }
) => {
	try {
		logger.trace(data, 'Events request data')
		const payload = JSON.stringify(data)
		await request.post({
			hostname,
			path: EVENTS_PATH,
			data: payload,
			query,
		})
		return true
	} catch (err) {
		logger.error(err)
		return false
	}
}
