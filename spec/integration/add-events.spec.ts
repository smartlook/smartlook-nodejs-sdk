import * as smartlook from '../../src'
import { CHECK_PATH, EVENTS_PATH } from '../../src/api'
import * as config from '../../src/config'
import { IPostRequestParams, IRequest, IRequestQuery } from '../../src/types'

describe('Smartlook SDK', () => {
	const KEY = '393939393'
	const PID = '519823579987'
	const STORE_GROUP = '30d'
	const CHECK_HOST = 'https://check.example.com'
	const ANALYTICS_HOST = 'https://events.example.com'
	let requests: IPostRequestParams[] = []

	const EVENT1 = {
		vid: 'visitor1',
		name: 'my_custom_event1',
		value: 'my_custom_value1',
		props: {
			my_custom_prop1: 'custom_prop_value1',
		},
	}

	const EVENT2 = {
		vid: 'visitor2',
		name: 'my_custom_event2',
		value: 'my_custom_value2',
		props: {
			my_custom_prop2: 'custom_prop_value2',
		},
	}

	const request: IRequest = {
		post: async (params: IPostRequestParams): Promise<any> => {
			requests.push(params)

			if (params.hostname === CHECK_HOST && params.path === CHECK_PATH) {
				return {
					pid: PID,
					analytics: {
						ok: true,
						host: ANALYTICS_HOST,
					},
					options: {
						storeGroup: STORE_GROUP,
					},
				}
			}

			return true
		},
	}

	it('Should allow to init the sdk', async () => {
		const result = await smartlook.init({
			flushIntervalMillis: 0,
			key: KEY,
			request,
			host: CHECK_HOST,
		})

		expect(result).toBe(true)
		expect(requests.length).toEqual(1)

		expect(requests[0].hostname).toEqual(CHECK_HOST)
		expect(requests[0].path).toEqual(CHECK_PATH)
		expect(requests[0].data).toEqual(JSON.stringify({ key: KEY }))
		expect(requests[0].query).toBeUndefined()

		requests = []
	})

	it('Should allow to add an event', () => {
		smartlook.event(EVENT1)

		smartlook.event(EVENT2)
	})

	it('Should allow to manually flush', async () => {
		const result = await smartlook.flush()

		expect(result).toEqual(2)
		expect(requests.length).toEqual(1)

		expect(requests[0].hostname).toEqual(ANALYTICS_HOST)
		expect(requests[0].path).toEqual(EVENTS_PATH)
		expect(requests[0].data).toEqual(
			JSON.stringify({
				events: [{ type: 'custom', ...EVENT1 }, { type: 'custom', ...EVENT2 }],
			})
		)
		expect(requests[0].query).toEqual({
			pid: PID,
			group: STORE_GROUP,
		})
	})

	afterAll(() => {
		config.reset()
	})
})
