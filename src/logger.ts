import * as os from 'os'
import * as util from 'util'
import { LogLevel } from './types'

const hostname = os.hostname()
const pid = process.pid

const LEVELS: { [level: string]: number } = {
	mute: 0,
	trace: 10,
	debug: 20,
	info: 30,
	error: 50,
}

let logLevel = 0

export const init = (level: LogLevel) => {
	logLevel = LEVELS[level] || 0
}

// outputs bunyan-cli compatible format
const logger = (minLevel: number) => (
	msgOrData: string | object,
	msg?: string
) => {
	const data = typeof msgOrData !== 'string' ? JSON.stringify(msgOrData) : null
	const message = msg || (!data && msgOrData) || null

	if (logLevel >= minLevel) {
		process.stdout.write(
			util.format(
				'{"name":"smartlook","hostname":"%s","pid":%d,"time":"%s","level":%s,"msg":"%s","data":%s,"v":0}\n',
				hostname,
				pid,
				new Date().toISOString(),
				minLevel,
				message,
				data
			)
		)
	}
}

export const trace = logger(10)
export const debug = logger(20)
export const info = logger(30)
export const error = logger(4)
