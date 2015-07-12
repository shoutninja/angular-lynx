describe('ninja.shout.lynx', function () {

    beforeEach(module('ninja.shout.lynx'));

    describe('API Constants', function () {

        it('should have proper base API URL',
            inject(['ninja.shout.constants.urls.firebase', 'ninja.shout.constants.urls.twitter',
                function (fbURL, twitterURL) {
                    fbURL.should.equal('https://eakjb-shout-ninja2.firebaseio.com');
                    twitterURL.should.equal('https://twitter.com');
                }]));

        it('should have proper constants',
            inject(['ninja.shout.constants.local.cookies.prefix', 'ninja.shout.constants.local.notifications.length',
                function (prefix, notificationLength) {
                    prefix.should.equal('ninja.shout.local.cookie');
                    length.should.be.a('number');
                }]));
    });
});