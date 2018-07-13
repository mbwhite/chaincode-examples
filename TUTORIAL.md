# Dev Workflow for Smart Contract and Client on the Hyperledger Fabric blockchain
> An opinionated tutorial showing a best practice approach  (in my view)


## High level design of the Distributed App
This is a little artificial as this tutorial is about the flow of development rather than the business use case. 
Hence in this scenario, we a controlling simple key-values in the world state, with operations on on it. 

We need a client that will be able to issue these operations

- set a new value
- get the existing value
- double the value if numeric
- quarter the value if numeric
- reverse the string if (it's a string)

## 

