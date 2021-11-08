const { assert } = require('chai')

const Color = artifacts.require('./Color.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Color', (accounts) =>{
    let contract

    before(async ()=> {
        contract = await Color.deployed()
    })

    describe('deployment', async ()=> {
        it('deploys successfully', async ()=> {
            const address = contract.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async ()=> {
            const name = await contract.name()
            assert.equal(name, 'Color')
        })

        it('has a symbol', async ()=> {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'COLOR')
        })
    })

    describe('minting', async ()=> {
        it('creates a new token', async ()=> {
           const result = await contract.mint('#4DDCEF')
           const totalSupply = await contract.totalSupply()
           //SUCCESS
           assert.equal(totalSupply, 1)
           const event = result.logs[0].args
           assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
           assert.equal(event.from, '0x000000000000000000000000000000000000000000000', 'from is correct')
           assert.equal(event.to, accounts[0], 'to is correct')

           //FAILURE: cannot mint same color twice
           await contract.mint('#4DDCEF').should.be.rejeccted;

        })
    })

    describe('indexing', async ()=>{
        it('lists colors', async ()=>{
            //mint 3 more tokens
            await contract.mint('#538BAF')
            await contract.mint('#AB456C')
            await contract.mint('#CBD457')
            const totalSupply = await contract.totalSupply()

            let color
            let result = []

            for (var i = 1; i <= totalSupply; i++){
                color = await contract.colors(i - 1)
                result.push(color)
            }

            let expected = ['#4DDCEF','#538BAF','#AB456C','#CBD457']
            assert.equal(result.join(','), expected.join(','))
        })
    })
})