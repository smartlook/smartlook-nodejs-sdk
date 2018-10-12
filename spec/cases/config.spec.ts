import * as config from '../../src/config'

describe('Config', () => {
	it('Should handle missing project key', () => {
		const result = config.init({
			key: '',
		})

		expect(result).toBe(false)
	})

	it('Should handle missing API hostname', () => {
		const result = config.init({
			key: '333',
			host: '',
		})

		expect(result).toBe(false)
	})

	it('Should change the internal config instance', () => {
		const result = config.init({
			key: '333333',
		})
		expect(result).not.toBe(false)

		const values = config.get()

		expect(values.key).toEqual('333333')
	})
})
