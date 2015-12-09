$(function () {

    // Load Foundation / Load ModalJS
    $(document).foundation();

    // Not sure how to make events in InfoView
    // trigger these functions - problems with modal
    // and backbone interaction?
    $("#locationButton").click(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error, geo_options);
        } else {
            alert("No Location? :(");
        }

        function success(position) {
            $("#locationButton").hide();
            $("#modalMenu").prepend("Lat: <span id='lat'>"+ position.coords.latitude.toFixed(4) +"</span><br>");
            $("#modalMenu").prepend("Long: <span id='long'>"+ position.coords.longitude.toFixed(4) +"</span><br>");
        }

        function error(error) {
            alert("Error #"+error.code+" : "+error.message);
        }

        var geo_options = {
            maximumAge : 30000,
            timeout : 27000
        }
    });

    $("#login").click(function() {
        // Need to check these values for correctness
        var obj = {
            "lat": $('#lat').text(),
            "long": $('#long').text(),
            "name": $("#name").val(),
            "color": $("#color").val(),
        };
        $.ajax({
            method: 'GET',
            url: '/login',
            contentType: 'application/json;charset=UTF-8',
            data: obj,
            error: function(jqXHR, text, thrown) {
                console.log(text + thrown);
            },
            success: function() {
                $("#loginModal").hide();
                location.reload();
            }
        });
    });

    var User = Backbone.Model.extend({
        defaults: function () {
            return {
                username: "Guest",
                color: "GuestColor"
            }
        },

        url: "/api/user",

        login: function () {

        }
    });
    window.thisUser = new User();
    window.thisUser.fetch();

    var HeaderView = Backbone.View.extend({
        el: $('#header'),

        events: {
            "click .login"  : "login",
            "click .logout" : "logout",
            "click .newPub" : "newPub"
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            console.log("Init Header for: ", this.model.get("username"));
            this.render();
        },

        render: function () {

            // Set greeting.
            // console.log(this.model.get("color"));
            var greet = "Hello, " + this.model.get("username");
            $('.greeting').text(greet);

            // Toggle Login/Logout
            if (this.model.get("username") != "Guest") {
                $('.logout').show();
                $('.login').hide();
            } else {
                $('.logout').hide();
                $('.login').show();
            }

            // Set user color (Harder than looks, css is super complex)
            // if (this.model.get("color") != "Guest") {
            //
            // } else {
            //
            // }
        },

        login: function (e) {
            console.log('login');
        },

        logout: function (e) {
            console.log('logout');
        },

        newPub: function (e) {
            console.log('newPub');
        }
    });
    window.headerView = new HeaderView({ model: window.thisUser });
});
