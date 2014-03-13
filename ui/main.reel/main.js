/**
 * @module ui/main.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;
var Jsonp = require("../../core/jsonp");
var Q = require("q");

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    imagesPromise: {
        value: null
    },

    subredditLabel: {
        value: "Cats Standing Up"
    },

    subredditId: {
        value: "catsstandingup"
    },

    constructor: {
        value: function Main() {
            this.super();
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.addPathChangeListener("subredditId", this, "handleSubredditIdChange");
                this.fetchImages();
            }
        }
    },

    handleSubredditIdChange: {
        value: function () {
            this.fetchImages();
        }
    },

    fetchImages: {
        value: function () {
            var subId = this.subredditId;

            if (!subId) {
                this.imagesPromise = null;
                return;
            }

            this.imagesPromise = Jsonp.request(
                "http://www.reddit.com/r/" + subId + ".json?limit=100", "jsonp")
            .then(function (jsonData) {
                var children = jsonData.data.children;

                return children.filter(function (item) {
                    return item.data.url.toLowerCase().match(/i.imgur.com\/[a-zA-Z0-9]+.(jpg|gif)/);
                }).map(function (item) {
                    return item.data.url.replace(".jpg", "m.jpg");
                })
            })
            .delay(1000);
        }
    }
});
