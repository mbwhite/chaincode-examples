'use strict';

// SDK Library to asset with writing the logic

// imaginee the next line to be
// const SmartContract = require('fabric-contract-api').SmartContract;
const SmartContract = require('fabric-shim').contractapi.SmartContract;

// Business logic pulling in 3rd parties
const _ = require('lodash');
const conv  = require('number-to-words');

/**
 * Support the Updating of values within the SmartContract
 */
class StringTasks extends SmartContract {

	constructor() {
		super('org.mynamespace.string');

		// going to leave the default 'not known function' handling alone
	}

	async kebabCase(api) {
		// console.info('Transaction ID: ' + api.getTxID());
		
		let value = await api.getState('dummyKey')
		let data = JSON.parse(value);
		if (data.type !== 'string' ){
			throw new Error('Value is not a string')
		} else {
			data.value=_.kebabCase(data.value);
			await api.putState('dummyKey',Buffer.from(JSON.stringify(data)));	
		}
	}

	async snakeCase(api) {
		// console.info('Transaction ID: ' + api.getTxID());
		
		let value = await api.getState('dummyKey')
		let data = JSON.parse(value);
		if (data.type !== 'string' ){
			throw new Error('Value is not a string')
		} else {
			data.value=_.snakeCase(data.value);
			await api.putState('dummyKey',Buffer.from(JSON.stringify(data)));	
		}
	}

	async camelCase(api) {
		// console.info('Transaction ID: ' + api.getTxID());
		
		let value = await api.getState('dummyKey')
		let data = JSON.parse(value);
		if (data.type !== 'string' ){
			throw new Error('Value is not a string')
		} else {
			data.value=_.camelCase(data.value);
			await api.putState('dummyKey',Buffer.from(JSON.stringify(data)));	
		}
	}

	async getString(api){
		// console.info('Transaction ID: ' + api.getTxID());
		
		let value = await api.getState('dummyKey')
		let data = JSON.parse(value);
		if (data.type !== 'string' ){
			throw new Error('Value is not a string')
		} else {
			return data.value;
		}
		
	}

	async setString(api,value){
		// console.info('Transaction ID: ' + api.getTxID());
		
		let i = _.parseInt(value)
		let data={type:'string'};

		if (isNaN(i)){
			// set it is
			data.value = value;
		} else {
			data.value = conv.toWords(i);
		}

		await api.putState('dummyKey',Buffer.from(JSON.stringify(data)));	
	}
};

module.exports = StringTasks;