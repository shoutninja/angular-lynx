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

    describe('Firebase Data: ninja.shout.lynx.api.forum', function () {

        it('should fetch an array of links from Lynx', inject(['ninja.shout.lynx.api.forum',
            function (forum) {
                forum.length.should.exist
                forum.length.should.equal(0);
                forum.$loaded(function () {
                    forum.length.should.be.above(0);
                });
            }]))

    });

    describe('Main Service: ninja.shout.lynx.abstract', function () {


        it('should validate links', inject(['ninja.shout.lynx.abstract',
            function (abstract) {
                abstract.isValid('https://www.google.com').should.be.true;
                abstract.isValid('file://www.google.com').should.be.false;
                abstract.isValid('https://www.google.com/q=adsfj;aldkjf;aldsvpofidpfi').should.be.true;
            }]));

        it('should return URLs', inject(['ninja.shout.lynx.api.forum','ninja.shout.lynx.abstract',
            function (forum,abstract) {
                forum.$loaded(function () {
                    abstract.getPostCount().should.be.above(0);
                    abstract.getUrl().should.be.a('string');
                });
            }]));

    });
});