import { IEvent, IEventType } from './types'

let events: IEvent[] = []

const defaultType: IEventType = 'custom'

export const add = (values: IEvent) => {
	if (!values) {
		return
	}

	events.push({
		type: defaultType,
		...values,
	})
}

export const flush = () => {
	const ref = events

	events = []

	return ref
}
