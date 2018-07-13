/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// test specific libraries
const chai = require('chai');
chai.should();
const expect = chai.expect;
chai.use(require('chai-as-promised'));
// chai.use(require('chai-things'));
const sinon = require('sinon');

const mlog= require('mocha-logger');
const NumericTasks = require('../lib/numerictasks')

const chaincodeStub = require('fabric-shim').Stub;

describe('Numeric tasks testing',()=>{

    let apiStub;
    let sandbox;
    let startingValue;
    let wrongType;

    before(()=>{
        startingValue = Buffer.from(JSON.stringify({type:'number',value:'42'}));
        wrongType = Buffer.from(JSON.stringify({type:'string',value:'hello'}));
    })

    beforeEach('Sandbox creation', () => {
        sandbox = sinon.createSandbox()
        apiStub = sandbox.createStubInstance(chaincodeStub);

    });

    afterEach('Sandbox restoration', () => {
        sandbox.restore();
    });

    describe('#setup',async ()=>{
        let nc = new NumericTasks();
        await nc.setup(apiStub);
        sinon.assert.calledWith(apiStub.putState,'dummyKey', Buffer.from("{}"));
    });

    describe('#setNumber', ()=>{
        it('should set a numeric value',async()=>{
            let nc = new NumericTasks();

            await nc.setNumber(apiStub,'42');
            let data={type:'number',value:42};
            let fortytwo = Buffer.from(JSON.stringify(data))
            sinon.assert.calledWith(apiStub.putState,'dummyKey',fortytwo);
        })
        it('should throw error if passed a non-numeric string',()=>{
            let sc = new NumericTasks();

            return sc.setNumber(apiStub,'A rather large whale').should.eventually.be.rejectedWith(/Sorry can't handle this/)
            
        })
        
    })

    describe('#getNumber',async ()=>{
        it('should get the numeric value set',async ()=>{
            apiStub.getState.resolves(startingValue);
            let nc = new NumericTasks();

            let v = await nc.getNumber(apiStub);
            expect(v).to.equal('42')
        })

        it('should throw erro if value is not a number',()=>{
            apiStub.getState.resolves(wrongType);
            let nc = new NumericTasks();
            return nc.getNumber(apiStub).should.eventually.be.rejectedWith(/Value is not a number/)
           
        })
    })

    describe('#doubleAssetValue',()=>{
        it('should double asset if number',async ()=>{
            apiStub.getState.resolves(startingValue);
            let nc = new NumericTasks();

            await nc.doubleAssetValue(apiStub);
            let data={type:'number',value:84};
            let eightyfour = Buffer.from(JSON.stringify(data))
            sinon.assert.calledWith(apiStub.putState,'dummyKey',eightyfour);
        })
        it('should throw error if not number',()=>{
            apiStub.getState.resolves(wrongType);
            let nc = new NumericTasks();
            return nc.doubleAssetValue(apiStub).should.eventually.be.rejectedWith(/Need to have numerc value/)
        })
    })
})