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
const StringTasks = require('../lib/stringtasks')

const chaincodeStub = require('fabric-shim').Stub;

describe('String tasks testing',()=>{

    let apiStub;
    let sandbox;
    let startingValue;
    let wrongType;

    before(()=>{
        startingValue = Buffer.from(JSON.stringify({value:'Hello from Mickey',type:'string'}));
        wrongType = Buffer.from(JSON.stringify({value:'42',type:'number'}));
    })

    beforeEach('Sandbox creation', () => {
        sandbox = sinon.createSandbox()
        apiStub = sandbox.createStubInstance(chaincodeStub);

    });

    afterEach('Sandbox restoration', () => {
        sandbox.restore();
    });


    describe('#kebabCase',()=>{
        it ('should convert to kebab case',async ()=>{
            let sc = new StringTasks();
            apiStub.getState.resolves(startingValue)
            
            await sc.kebabCase(apiStub);
            let correctValue = Buffer.from(JSON.stringify({value:'hello-from-mickey',type:'string'}));
            sinon.assert.calledWith(apiStub.putState,'dummyKey',correctValue);
        });

        it ('should reject with error if not a string',()=>{
            let sc = new StringTasks();
            apiStub.getState.resolves(wrongType)          
            return sc.kebabCase(apiStub).should.eventually.be.rejectedWith(/Value is not a string/);
        })
    });

    describe('#camelCase',()=>{
        it ('should convert to kebab case',async ()=>{
            let sc = new StringTasks();
            apiStub.getState.resolves(startingValue)
            
            await sc.camelCase(apiStub);
            let correctValue = Buffer.from(JSON.stringify({value:'helloFromMickey',type:'string'}));
            sinon.assert.calledWith(apiStub.putState,'dummyKey',correctValue);
        });

        it ('should reject with error if not a string',()=>{
            let sc = new StringTasks();
            apiStub.getState.resolves(wrongType)          
            return sc.camelCase(apiStub).should.eventually.be.rejectedWith(/Value is not a string/);
        })
    });

    describe('#snakeCase',()=>{
        it ('should convert to kebab case',async ()=>{
            let sc = new StringTasks();
            apiStub.getState.resolves(startingValue)
            
            await sc.snakeCase(apiStub);
            let correctValue = Buffer.from(JSON.stringify({value:'hello_from_mickey',type:'string'}));
            sinon.assert.calledWith(apiStub.putState,'dummyKey',correctValue);
        });

        it ('should reject with error if not a string',()=>{
            let sc = new StringTasks();
            apiStub.getState.resolves(wrongType)          
            return sc.snakeCase(apiStub).should.eventually.be.rejectedWith(/Value is not a string/);
        })
    });

    describe('#setString',()=>{
        it('should convert to words if  number used',async ()=>{
            let sc = new StringTasks();

            await sc.setString(apiStub,'42');
            let data={type:'string',value:'forty-two'};
            let fortytwo = Buffer.from(JSON.stringify(data))
            sinon.assert.calledWith(apiStub.putState,'dummyKey',fortytwo);
        })
        it('should set the string',async ()=>{
            let sc = new StringTasks();

            await sc.setString(apiStub,'A rather large whale');
            let data={type:'string',value:'A rather large whale'}
            // let fortytwo = Buffer.from(JSON.stringify(data))
            sinon.assert.calledWith(apiStub.putState,'dummyKey',Buffer.from(JSON.stringify(data)));
        })
        
    })
})