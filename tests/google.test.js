var request = require('request');
var testing = JSON.stringify("seonteg");

describe("google", function () {
    it("should respond with hello world", function(done) {

        params = {
            url: "http://testHappkido.herokuapp.com/google/googleGrades",
            form:  testing ,
            headers: [
                {
                    name: 'content-type',
                    value: 'application/json'
                }
            ]
        };

        return request
            .post(params, function name(err, resp, body) {
                expect(resp.statusCode).toEqual(200);
                console.log("66666666skdfngkdjnfgksjdnfg;kjnad;fgjna;dfjg;akdjfbg;kadjfbg;akjdbf;kgbadk;fjbg" + resp.data);
                expect(body).toEqual("OK");
                done();
            });
    });
});