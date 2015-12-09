$(function () {

    // NOT SURE IF THIS IS NECESSARY OR IF
    // CAN BE DONE WITH JUST A VIEW

    // var Pub = Backbone.Model.extend({
    //
    // });
    // var thisPub = new Pub();
    //
    // var Pubs = Backbone.Collection.extend({
    //
    // });
    // var pubs = new Pubs();
    // pubs.fetch();

    // Not sure if this can be done inside the view - since
    // pub links are dynamically added.
    $(document).on('click', '.pub_link', function (e) {
        joinRoom($(e.target).attr('id'));
        $('#map').hide();
        $('#chat').show();
        window.thisPub.url = '/api/place/' + $(e.target).attr('id');
        window.thisPub.fetch();
        // window.location.href = $(e.target).attr('id');
    });

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
                        map.setView([data.user.lat, data.user.long], 12);

                        myLayer.setFilter( function(feature) {
                            var usrlatlng = L.latLng(data.user.lat, data.user.long);
                            var placelatlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                            var inRadius = usrlatlng.distanceTo(placelatlng);
                            if (inRadius < feature.properties.radius) { // if yes,
                                feature.properties.description =
                                // just use a button and jquery func to take some attribute (not href) as link location
                                // for some reason href attributes won't show up in the popup.
                                    'Nice to see ya, ' + data.user.un + '!<br>' +
                                    '<button class="pub_link" id="' + feature.properties.title +
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
    window.mapView = new MapView();
});
