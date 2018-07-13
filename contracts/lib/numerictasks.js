'use strict';

// SDK Library to asset with writing the logic

// imaginee the next line to be
// const SmartContract = require('fabric-contract-api').SmartContract;
const SmartContract = require('fabric-shim').contractapi.SmartContract;

// Business logic (well just util but still it's general purpose logic)
const util = require('util');

const _ = require('lodash');

/**
 * Support the Updating of values within the SmartContract
 */
class UpdateValues extends SmartContract {

	/** 
	 * Sets a namespace so that the functions in this particular class can 
	 * be separated from others.
	 */
	constructor() {
		super('org.mynamespace.numeric');
		this.$setUnknownFn(this.unknownFn);
	}

	/** The function to invoke if something unkown comes in.
	 * 
	 */
	async uknownFn(api){
		console.log("Big Friendly letters ->>> DON\'T PANIC")
	}

	/**
	 * A function that will setup a starting value
	 * Note that this is not expliclity called from init.  IF you want it called from init, then
	 * specifiy it in the fn name when init is invoked.
	 * 
	 * @param {api} api 
	 */
	async setup(api){
		return api.putState('dummyKey', Buffer.from("{}"));
	}

	async setNumber(api,value){
		// console.info('Transaction ID: ' + api.getTxID());
		
		let i = _.parseInt(value)
		let data={type:'number'};

		if (isNaN(i)){
			throw new Error('Sorry can\'t handle this')
		} else {
			data.value = i
		}

		await api.putState('dummyKey',Buffer.from(JSON.stringify(data)));	
	}

	/**
	 * Doubles the api if it is a number fail otherwise
	 * @param {api} api 
	 */
	async doubleAssetValue(api) {
		console.info(`Transaction ID: ${api.getTxID()}`);

		let data = JSON.parse(await api.getState('dummyKey'))
		if (data.type!=='number') {
			let str = `Need to have numerc value`;
			
			throw new Error(str);
		} else {
			data.value = data.value*2;
			await api.putState('dummyKey',Buffer.from(JSON.stringify(data)));
			return data.value;						
		}
	}
	/**
	 * Doubles the api if it is a number fail otherwise
	 * @param {api} api 
	 */
	async quarterNumber(api) {
		console.info(`Transaction ID: ${api.getTxID()}`);

		let data = JSON.parse(await api.getState('dummyKey'));
		if (data.type!=='number') {
			let str = `'Need to have numerc value set to double it, ${value}`;
			console.error(str);
			throw new Error(str);
		} else {
			data.value = data.value/4;
			await api.putState('dummyKey',Buffer.from(JSON.stringify(data)));
			return data.value;						
		}
	}

	async getNumber(api){
		// console.info('Transaction ID: ' + api.getTxID());
		
		let data = JSON.parse(await api.getState('dummyKey'))
		
		if (data.type !== 'number' ){
			throw new Error('Value is not a number')
		} else {
			return data.value;
		}
		
	}

};

module.exports = UpdateValues;