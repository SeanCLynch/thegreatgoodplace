$(document).ready(function () {

    // Load ModalJS
    $(document).foundation();

    // Not sure how to make events in InfoView
    // trigger these functions - problems with modal
    // and backbone interaction?
    $("#locationButton").click(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error, geo_options);
        } else {
            alert("No Location? :/");
        }

        function success(position) {
            $("#locationButton").hide();
            $("#modalMenu").prepend("Lat: <a id='lat'>"+ position.coords.latitude.toFixed(4) +"</a><br>");
            $("#modalMenu").prepend("Long: <a id='long'>"+ position.coords.longitude.toFixed(4) +"</a><br>");
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

    $(document).on('click', '.pub_link', function (e) {
        window.location.href = $(e.target).attr('id');
    });

    // Backbone Views:
    var HeaderView = Backbone.View.extend({
        el: $('#header'),

        events: {

        },

        initialize: function () {

        },

        render: function () {

        },

        login: function (e) {
            console.log('login');
        }
    });
    var headerView = new HeaderView();

    var MapView = Backbone.View.extend({
        el: $('#map'),

        initialize: function () {
            $.ajax({
                url: "/getPlaces",
                success: function (data) {
                    // Configure the map
                    L.mapbox.accessToken = data.config.MBAccessToken;
                    var map = L.mapbox.map("map", data.config.MBMapId).setView([40, -74.50], 9);
                    var myLayer = L.mapbox.featureLayer(data.places.feats)
                        .on('mouseover', function(e) {
                            e.layer.openPopup();
                        })
                        .on('click', function(e) {
                            e.layer.closePopup();
                        })
                        .addTo(map);

                    // Add pretty little circles.
                    for (var cir in data.places.circles) {
                        var filterCircle = L.circle(   L.latLng(data.places.circles[cir].lat,
                                                                data.places.circles[cir].long),
                                                                data.places.circles[cir].radius, {
                            opacity: data.places.circles[cir].opacity,
                            weight: data.places.circles[cir].weight,
                            fillOpacity: data.places.circles[cir].fillOpacity
                        }).addTo(map);
                    }
                    // If you are logged in:
                    // Add the user to the map and
                    // update popups with proper messages.
                    if (data.user.un) {
                        L.mapbox.featureLayer({
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                // coordinates here are in longitude, latitude order because
                                // x, y is the standard for GeoJSON and many formats
                                coordinates: [
                                  data.user.long,
                                  data.user.lat
                                ]
                            },
                            properties: {
                                title: data.user.un,
                                description: 'Wandering',
                                'marker-size': 'medium',
                                'marker-color': data.user.color, // '#c14e4e'
                                'marker-symbol': 'pitch'
                            }
                        }).addTo(map);
                        map.setView([data.user.lat, data.user.long], 10);

                        myLayer.setFilter( function(feature) {
                            var usrlatlng = L.latLng(data.user.lat, data.user.long);
                            var placelatlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                            var inRadius = usrlatlng.distanceTo(placelatlng);
                            if (inRadius < feature.properties.radius) { // if yes,
                                feature.properties.description =
                                // just use a button and jquery func to take some attribute (not href) as link location
                                // for some reason href attributes won't show up in the popup.
                                    'Nice to see ya, ' + data.user.un + '!<br>' +
                                    '<button class="pub_link" id="/p/' + feature.properties.title +
                                    '">Enter</button>';
                            } else { // if no,
                                feature.properties.description = feature.properties.title + " is too far away, sorry!";
                            }
                            // could also filter shit that is wayyyyyyyyyyyy to
                            // far away here. Just return false for certain distances.
                            return true;
                        });
                    }
                },
                dataType: "json"
            });
            this.render();
        },

        render: function () {

        }
    });
    var mapView = new MapView();
});
