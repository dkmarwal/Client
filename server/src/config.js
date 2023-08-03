import path from 'path'
import merge from 'lodash/merge'

const requireProcessEnv = (name) => {
	if (!process.env[name]) {
		throw new Error('You must set the ' + name + ' environment variable')
	}
	return process.env[name]
}

const config = {
	all: {
		env: process.env.NODE_ENV || 'develop',
		root: path.join(__dirname, '..'),
		port: 9001,
		ip: process.env.IP || '0.0.0.0',
		apiRoot: ''
	},
    develop: {
        port: 9001,
        apiRoot: ''
	},
	uat: {
		port: 9001,
        apiRoot: ''
	},
	CITI_UAT: {
		port: 9001,
        apiRoot: ''
	},
	CITI_CTE: {
		port: 9101,
        apiRoot: ''
	},
	production: {
		port: 9001,
	},
	AWS_CC_DEV: {
		port: 9001,
	},
	AWS_CC_UAT: {
		port: 9001,
	},
    PRE_PROD: {
		port: 9901,
	},
    USBANK_DEV: {
		port: 9001,
	},
    US_UAT: {
		port: 9001,
	},
	US_QC: {
		port: 9001
	},
	US_PREPROD: {
		port: 9001,
	},
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
