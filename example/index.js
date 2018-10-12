const dotenv = require('dotenv')

dotenv.load()

const smartlook = require('@smartlook/nodejs-sdk')

const main = () => {
	const status = smartlook.init()

	if (!status) {
		return
	}

	let i = Math.round(Math.random()*1000)
	const handle = setInterval(() => {
		smartlook.event({
			vid: `visitor_${i}`,
			name: 'backend_login',
			value: `custom_event_value_${i}`,
			props: {
				source: i%2 ? 'google' : 'facebook'
			}
		})

		if (Math.random() > 0.5) {
			smartlook.event({
				vid: `visitor_${i}`,
				name: 'backend_pay',
				value: `custom_event_value_${i}`,
				props: {
					package: i%2 ? 'power' : 'starter'
				}
			})
		}

		if (Math.random() > 0.75) {
			smartlook.event({
				vid: `visitor_${i}`,
				name: 'backend_share',
				value: `custom_event_value_${i}`,
				props: {
					platform: i%2 ? 'twitter' : 'instagram'
				}
			})
		}
		i++
	}, 1000)

	setTimeout(() => {
		smartlook.stop()
		clearInterval(handle)
	}, 35000).unref()
}

main()
