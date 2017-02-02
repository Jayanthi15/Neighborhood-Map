// Zomato API key
var zomato_API_key = 'a1107b14639b6acb1198609bad4d4ff1';
// Restaurants array objects
var restaurants = [{
        id: '69256',
        name: 'Anjappar',
        lattitude: '13.006403',
        longitude: '80.250178'
    },
    {
        id: '66698',
        name: 'Dindigul Thalappakatti',
        lattitude: '13.002734',
        longitude: '80.272395'
    },
    {
        id: '69024',
        name: 'That Madras Place',
        lattitude: '13.005817',
        longitude: '80.250664'
    },
    {
        id: '66635',
        name: 'Hotel Crescent',
        lattitude: '13.005504',
        longitude: '80.257455'
    },
    {
        id: '65228',
        name: 'Hot Chips',
        lattitude: '13.006486',
        longitude: '80.244375'
    },
    {
        id: '65517',
        name: 'Hotel Saravana Bhavan',
        lattitude: '12.985774',
        longitude: '80.245930'
    },
    {
        id: '65881',
        name: 'A2B - Adyar Ananda Bhavan',
        lattitude: '12.996906',
        longitude: '80.258382'
    },
    {
        id: '68648',
        name: 'Buhari',
        lattitude: '12.979415',
        longitude: '80.226374'
    },
    {
        id: '65384',
        name: 'Murugan Idli Shop',
        lattitude: '12.995662',
        longitude: '80.270287'
    },
    {
        id: '71861',
        name: 'McDonald\'s',
        lattitude: '13.006892',
        longitude: '80.254242'
    },
    {
        id: '71768',
        name: 'Waffles Thru The Day',
        lattitude: '12.996383',
        longitude: '80.252531'
    },
    {
        id: '65186',
        name: 'Eden',
        lattitude: '12.997711',
        longitude: '80.267610'

    },
    {
        id: '65651',
        name: 'Zaitoon',
        lattitude: '12.996906',
        longitude: '80.256114'
    },
    {
        id: '67504',
        name: 'Cafe Coffee Day Express',
        lattitude: '12.990675',
        longitude: '80.215623'
    },
    {
        id: '67341',
        name: 'KFC',
        lattitude: '13.000443',
        longitude: '80.270799'
    },
    {
        id: '65151',
        name: 'Domino\'s Pizza',
        lattitude: '13.004948',
        longitude: '80.251700'
    },
    {
        id: '68429',
        name: 'Subway',
        lattitude: '12.998892',
        longitude: '80.251876'
    }
];
// Restaurant Model stores the basic data about a restuarant
var Restaurant = function(RestaurantData) {
    this.id = ko.observable(RestaurantData.id);
    this.name = ko.observable(RestaurantData.name);
    this.lattitude = ko.observable(RestaurantData.lattitude);
    this.longitude = ko.observable(RestaurantData.longitude);
    this.active = ko.observable(false);
};
// Custom binding to prepend a glyphicon to each the restaurant name in UI.
ko.bindingHandlers.customRestaurantName = {
    init: function(element, valueAccessor) {
        var span = document.createElement('span'),
            targetText = valueAccessor();
        span.classList.add('glyphicon', 'glyphicon-map-marker');
        ko.applyBindingsToNode(element, {
            html: span.outerHTML + targetText()
        });
    }
};
// Restaurant View Model which acts like a octopus/controller.
// Restaurant View Model connects both the view and model.
var RestaurantViewModel = function() {
    // `this` is assigined to a variable named self which points to the RestaurantViewModel.
    var self = this;
    this.restaurantList = ko.observableArray([]);
    this.currentRestaurant = ko.observable();
    this.numberOfClicks = ko.observable(0);
    this.bounds = new google.maps.LatLngBounds();
    this.markers = ko.observableArray([]);
    this.error_message = ko.observable('');
    this.search_text = ko.observable('');
    this.infoWindow = new google.maps.InfoWindow();
    // Google Map is initialized
    this.map = new google.maps.Map(document.getElementById('google_maps'), {
        center: {
            lat: 13.0012,
            lng: 80.2565
        },
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoom: 11
    });
    // selectRestaurant function is called when the user clicks on the restaurant list.
    // This function will set th clicked item/restaurant as current restaurant and will call the getZomatoDetails function with the matching marker.
    this.selectRestaurant = function(restaurant) {
        $('#top_navigation_collapse').collapse('hide');
        if (self.currentRestaurant()) {
            self.currentRestaurant().active(false);
        }
        self.currentRestaurant = ko.observable(restaurant);
        self.currentRestaurant().active(true);
        var current_marker = ko.utils.arrayFirst(self.markers(), function(item) {
            return item.id === self.currentRestaurant().id();
        });
        self.getZomatoDetails(self.currentRestaurant().id(), current_marker);
    };
    // clearMarkers function is used to clear the marker on the map.
    this.clearMarkers = function() {
        for (var i = 0; i < self.markers().length; i++) {
            self.markers()[i].setMap(null);
        }
        self.markers.removeAll();
    };
    // closeclick event is called when user closes the info window which will rebound the map and clears the current restaurant.
    google.maps.event.addListener(this.infoWindow, 'closeclick', function(event) {
        self.getMapBounds();
        self.currentRestaurant().active(false);
    });
    // getMapBounds function is used to calculate the map boundary based upon the markers currently available on the map.
    this.getMapBounds = function() {
        self.bounds = new google.maps.LatLngBounds();
        ko.utils.arrayForEach(self.markers(), function(marker) {
            self.bounds.extend(marker.getPosition());
        });
        self.map.fitBounds(self.bounds);
    };
    // createMarker function creates a marker on the map
    this.createMarker = function(restaurantData) {
        var map_coords = new google.maps.LatLng(restaurantData.lattitude, restaurantData.longitude);
        var marker = new google.maps.Marker({
            position: map_coords,
            map: this.map,
            icon: './images/map-icon-2.png',
            draggable: false,
            id: restaurantData.id
        });
        self.markers.push(marker);
        // click event is bind to the marker which when click will call getZomatoDetails function.
        marker.addListener('click', function() {
            $('#top_navigation_collapse').collapse('hide');
            var clicked_marker = this;
            var current_rest = ko.utils.arrayFirst(self.restaurantList(), function(item) {
                return item.id() === clicked_marker.id;
            });
            if (self.currentRestaurant()) {
                self.currentRestaurant().active(false);
            }
            self.currentRestaurant = ko.observable(current_rest);
            self.currentRestaurant().active(true);
            self.getZomatoDetails(self.currentRestaurant().id(), marker);

        }, false);
    };
    // getZomatoDetails function will fetch the details about a restuarant from a third-party service.
    // This function uses AJAX to fetch the details from the API and the fetched details are build up as HTML and populated on the infowindow.
    self.getZomatoDetails = function(id, marker) {
        $.ajax({
            url: 'https://developers.zomato.com/api/v2.1/restaurant',
            headers: {
                'user-key': zomato_API_key
            },
            data: {
                'res_id': id
            },
            success: function(result) {
                var infoWindowMarkup = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h2 id="infoTopHeading" class="infoHeading"><a target="_blank" href="' + result.url + '">' + result.name + '</a><span class="badge" style="background-color:#' + result.user_rating.rating_color + '">' + result.user_rating.aggregate_rating + '</span></h2>' +
                    '<h4 id="infoSubHeading" class="infoCuisines">' + result.cuisines + '</h4>' +
                    '<div class="infoBodyContantainer">' +
                    '<div class="infoAddress">' +
                    '<address><strong>Address</strong><br> ' + result.location.address + '</address></br>' +
                    '<strong>Average Cost for Two:</strong> ' + result.currency + result.average_cost_for_two + '</br>' +
                    '<strong>User Rating:</strong> ' + result.user_rating.rating_text + '<br>' +
                    '<strong>Has Online Delivery:</strong> ' + (result.has_online_delivery ? 'Yes' : 'No') + '<br>' +
                    '<strong>Is Delivering Now:</strong> ' + (result.is_delivering_now ? 'Yes' : 'No') + '<br>' +
                    '</div>' +
                    '<div class="imageContainer"><img height="150" src="' + result.thumb + '" alt="' + result.name + '"></div></div>' +
                    '<div id="infoFooterContainer">' +
                    '<strong>Zomato Link:</strong> <a target="_blank" href="' + result.url + '">' + result.name + '</a>' +
                    ' | <a target="_blank" href="' + result.photos_url + '">Photos</a>' +
                    ' | <a target="_blank" href="' + result.menu_url + '">Menu</a>' +
                    '</div>' +
                    '</div>';
                self.infoWindow.setContent(infoWindowMarkup);
                self.infoWindow.open(self.map, marker);
                self.map.setCenter(marker.getPosition());
                self.map.setZoom(16);
            },
            error: function(jqXHR, exception) {
                // Error function is called when the AJAX function failed for any of the below mentioned reason and will be notified on the UI
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Please verify your Network';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error';
                } else if (exception === 'abort') {
                    msg = 'Request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                self.error_message(msg);
                $('#ajax_error').show();
            }
        });

    };
    // searchRestaurant function is used to search the queried input upon the available restaurant list and the restaurants matching the query will shown on the UI.
    // If the search query is empty the all the restaurants will be returned.
    this.searchRestaurant = function() {
        self.infoWindow.close();
        if (self.search_text().length > 0) {
            var searchedList = ko.utils.arrayFilter(restaurants, function(item) {
                return item.name.toLowerCase().indexOf(self.search_text().toLowerCase()) !== -1;
            });
            self.clearMarkers();
            self.setupRestaurants(searchedList);
        } else {
            self.setupRestaurants(restaurants);
        }
    };
    // setupRestaurants function restaurants array as parameter.
    // This function instantiated a new Restaurant model and is pushed into an observable array.
    // Then the createMarker function is called to create markers on the map.
    this.setupRestaurants = function(restaurants) {
        self.restaurantList.removeAll();
        ko.utils.arrayForEach(restaurants, function(resItem) {
            self.restaurantList.push(new Restaurant(resItem));
            self.createMarker(resItem);
        });
        if (self.restaurantList().length > 0) {
            self.getMapBounds();
        }
    };
    self.setupRestaurants(restaurants);
};
// mapError is called by the google script tag when there is error loading the map
var mapError = function() {
    $('#map_error').show();
};
// loadGoogleMap is called once after the google script is fully loaded on the page.
var loadGoogleMap = function() {
    ko.applyBindings(new RestaurantViewModel());
};