import * as request from '../../src/request'

describe('Request', () => {
	it('Should throw with invalid host', done => {
		request
			.post({
				data: 'test data',
				hostname: 'hellothere',
				path: '/hello',
				query: {
					param: 'value',
				},
			})
			.then(() => {
				throw new Error('Expect to throw')
			})
			.catch(err => {
				expect(err.code).toEqual('ENOTFOUND')
				done()
			})
	})
})
