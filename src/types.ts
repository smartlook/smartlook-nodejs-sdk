export interface IConfig {
	key: string
	flushIntervalMillis: number
	host: string
	request: IRequest
	logLevel: LogLevel
	logger: ILogger
}

export type IEventType = 'custom' | 'error'

export interface IEvent {
	vid: string
	name: string
	value?: string
	props?: IProps
	sid?: string
	type?: IEventType
}

interface IProps {
	[key: string]: number | string | boolean
}

export interface ICheckResponse {
	pid: string
	analytics?: {
		ok: boolean
		error?: string
		host?: string
	}
	options: {
		storeGroup: string
	}
}

export interface IRequestQuery {
	[key: string]: string
}

export interface IEventsQuery extends IRequestQuery {
	group: string
	pid: string
	vid?: string
	sid?: string
	rid?: string
}

export interface IRequest {
	post: <T>(params: IPostRequestParams) => Promise<T>
}

export interface IPostRequestParams {
	hostname: string
	path: string
	data: string
	query?: IRequestQuery
}

export type LogLevel = 'mute' | 'trace' | 'debug' | 'info' | 'error'

export interface ILogger {
	trace: (data: string) => void
	debug: (data: string) => void
	info: (data: string) => void
	error: (data: string) => void
}
