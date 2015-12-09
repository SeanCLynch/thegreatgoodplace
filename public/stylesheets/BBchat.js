$(function () {
    var Pub = Backbone.Model.extend({

    });
    var thisPub = new Pub();
    thisPub.url = '/api/place/' + ###;
    thisPub.fetch();

    var Message = Backbone.Model.extend({

    });
    var msg = new Message();

    var Messages = Backbone.Collection.extend({

    });
    var messages = new Messages();

    var chatView = Backbone.View.extend({
        el: $('chat'),


    });
    var chatView = new chatView();
});
