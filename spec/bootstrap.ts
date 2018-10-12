import { install } from 'source-map-support'

install()

import Jasmine = require('jasmine')
import * as reporter from 'jasmine-spec-reporter'
import * as path from 'path'

// global variables
process.env.ROOT_DIR = path.resolve(__dirname, '..')
process.env.JASMINE_CONFIG =
	process.env.JASMINE_CONFIG || 'spec/support/jasmine.json'

// create jasmine
const jRunner = new Jasmine(null)

jRunner.env.clearReporters()

jRunner.addReporter(new reporter.SpecReporter({
	prefixes: {
		failed: 'ERROR | ',
		pending: 'WAIT | ',
		successful: 'OK | ',
	},
	// tslint:disable-next-line:no-any
}) as any)

// load configuration
jRunner.loadConfigFile(process.env.JASMINE_CONFIG)
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

// execute tests
const files = process.env.FILE ? process.env.FILE.split(',') : null
const filter = process.env.FILTER || null

jRunner.execute(files, filter)
