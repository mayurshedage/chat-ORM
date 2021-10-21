//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
var expect = chai.expect;

chai.should();
chai.use(chaiHttp);

describe('APIKeyModel', () => {
    /*
      * Test the /GET route
    */
    describe('/GET apikeys', () => {
        it('it should GET all the apikeys', (done) => {
            chai.request('http://2138954385ae02.chat-us.cometondemand.com:8000/')
                .get('v1.0/apikeys')
                .set('apiKey', 'd027ffb7a626ed5ae7ddf186efa1ed3ccba3ada6')
                .end((err, res) => {
                    console.log(res.body);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.have.key('data');
                    expect(res.body.data).to.be.an('array');
                    done();
                });
        });
    });
});