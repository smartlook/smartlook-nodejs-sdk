import * as https from 'https'
import * as querystring from 'querystring'
import * as logger from './logger'
import { IPostRequestParams } from './types'

export const post = <T>(params: IPostRequestParams): Promise<T> => {
	const options = {
		hostname: params.hostname,
		path: `${params.path}?${querystring.stringify(params.query)}`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(params.data),
		},
	}

	logger.trace(`${options.method} ${options.hostname}${options.path}`)

	return new Promise((resolve, reject) => {
		const req = https.request(options, res => {
			res.on('data', (d: Buffer) => {
				let responseData
				try {
					responseData = JSON.parse(d.toString('utf8').trim())
					logger.trace(responseData, 'API response')
				} catch (err) {
					logger.error(
						`Unable to parse '${options.path}' response ${d.toString()}`
					)
				}
				if (res.statusCode < 300) {
					resolve(responseData)
				} else {
					reject(`API request failed: ${res.statusCode}`)
				}
			})
		})

		req.on('error', e => {
			logger.error(e)
			reject(e)
		})
		req.write(params.data)
		req.end()
	})
}
