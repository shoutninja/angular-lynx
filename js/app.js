angular.module('ninja.shout.lynx', ['firebase'])
    //Constants
    .constant("ninja.shout.constants.urls.firebase", "https://eakjb-shout-ninja2.firebaseio.com")
    .constant("ninja.shout.constants.urls.twitter", "https://twitter.com")

    .constant("ninja.shout.constants.local.cookies.prefix", "ninja.shout.local.cookie")

    .constant("ninja.shout.constants.local.notifications.length", 2000)

    .service("ninja.shout.lynx.urls", ["ninja.shout.constants.urls.firebase", function (fbURL) {
        this.lynx = fbURL + "/lynx";
        this.forum = this.lynx + "/categories/forum";
    }])

    //Load the repo
    .factory("ninja.shout.lynx.api.forum", ["$firebase", "ninja.shout.lynx.urls", function ($firebase, urls) {
        return $firebase(new Firebase(urls.forum)).$asArray();
    }])


    .service("ninja.shout.lynx.abstract", ["ninja.shout.lynx.api.forum", function (forum) {
        this.allowedPrefixes = ["http://", "https://"];

        /**
         * Returns the number of posts in the Lynx forum
         * @returns {Number}
         */
        this.getPostCount = function () {
            return forum.length;
        };

        /**
         * Validates a url for the firebase
         * @param url
         * @returns {boolean}
         */
        this.isValid = function (url) {
            var valid = false;
            angular.forEach(this.allowedPrefixes, function (prefix) {
                if (url.indexOf(prefix) == 0) valid = true;
            });
            return valid;
        };

        /**
         * Validates the entire database. This is run by multiple clients due to firebase's rule system
         */
        this.validate = function () {
            var urls = [];
            angular.forEach(forum, function (post) {
                //Strip trailing slash
                var postUrl = post.url;
                if (postUrl.substr(-1) == '/') {
                    postUrl = postUrl.substr(0, postUrl.length - 1);
                }
                //Check validity
                if (urls.indexOf(postUrl) > 0 || !this.isValid(postUrl)) {
                    forum.$remove(post);
                }
                else {
                    urls.push(postUrl);
                }
            }, this);
        };

        /**
         * Submit a link to firebase.
         *
         * @param url The link to submit
         * @param success Callback for success
         * @param failure Callback for failure
         * @param notify Callback for either case
         * @returns {boolean} If the submission was successful
         */
        this.submit = function (url, success, failure, notify) {
            //Ensure url exists
            if (!url) {
                if (failure) failure("No URL Available");
                if (notify) notify();
                return false;
            }

            //Ensure url is not a duplicate
            for (var i = 0; i < forum.length; i++) {
                if (forum[i].url == url) {
                    //Not all entries have a .submissions property, so add it if it doesn't
                    if (!forum[i].submissions) {
                        forum[i].submissions = 1;
                    }

                    //Increase dankness if a duplicate has been submitted
                    forum[i].submissions++;
                    forum.$save(i);

                    //Run failure callback if it's a duplicate
                    if (failure) failure("Duplicate. Dankness: " + (0 || forum[i].submissions));
                    if (notify) notify();

                    //Validate the database
                    this.validate();

                    //The link was not added, so return false
                    return false;
                }
            }

            //The link was not a duplicate, so add it
            forum.$add({
                url: url,
                timestamp: Firebase.ServerValue.TIMESTAMP
            }).then(success, failure, function (arg) {
                this.validate();
                if (notify) notify();
            });

            //Return true because the link was submitted
            return true;
        };

        /**
         * Get a random entry from the firebase database.
         * @returns {*}
         */
        this.getUrl = function () {
            return forum[Math.floor((Math.random() * forum.length))].url;
        };
    }]);