$(function () {
    $('#chat').hide();

    var Pub = Backbone.Model.extend({
        defaults: function () {
            return {
                title: "Default"
            }
        }

    });
    window.thisPub = new Pub();
    // thisPub.url = '/api/place/' + 'something';
    // thisPub.fetch();
    //
    // var Message = Backbone.Model.extend({
    //
    // });
    // var msg = new Message();
    //
    // var Messages = Backbone.Collection.extend({
    //
    // });
    // var messages = new Messages();

    var chatView = Backbone.View.extend({
        el: $('#chat'),

        events: {
            "click .msg-submit"  : "sendMsg",
            "keyup .msg-box" : "keyAction"
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        render: function () {
            $('.pubTitle').text(this.model.get('title'));
            // console.log(this.model.get("title"));
        },

        sendMsg: function () {
            socket.emit('roomMsg', this.model.get('title'), window.thisUser.get('username'), $('.msg-box').val());
            newMessage(window.thisUser.get('username'), $('.msg-box').val());
            $('.msg-box').val('');
        },

        keyAction: function (e) {
            // If they hit enter:
            if (e.which == 13) {
                socket.emit('roomMsg', this.model.get('title'), window.thisUser.get('username'), $('.msg-box').val());
                newMessage(window.thisUser.get('username'), $('.msg-box').val());
                $('.msg-box').val('');

            }
        }

    });
    window.chatView = new chatView({ model: window.thisPub });
});
