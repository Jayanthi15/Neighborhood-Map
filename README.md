## Neighborhood Map - Overview
A single page application featuring a map of a neighborhood Restaurants. Additional functionality is added to this map including highlighted locations, third-party data about those locations and various ways to browse the content.

### Features

1. HTML and CSS are validated by [HTML Validator](https://validator.w3.org) and [CSS Validator] (https://jigsaw.w3.org/css-validator/). Found no issues.
2. [**knockoutJS**] (http://knockoutjs.com/) framework is implemented to achieve MVVM design pattern.
3. Google Maps API helps in populating the Restaurants/marker on the map.
4. The Restaurant's details are fetched from **_Zomato_** API using JQuery's AJAX(Asynchronous JavaScript and XML).
5. Search box provided which will filter the restaurants list and the map markers based on the filter/search query.
   
### Extra

1. Google Map's Info Window exhibits the restaurant's featured image, address, meta data which the API provides.
2. Map boundary is panned/resized according the available markers on the map even after filtering the restaurants. 

## GUIDE TO GET STARTED WITH THIS PROJECT

Please find a file named **_index.html_** in this repository and open it in any browser.
    
### How will I complete this Project?

1. Review our course [JavaScript Design Patterns] (https://www.udacity.com/course/ud989-nd).
2. Download the [Knockout framework] (http://knockoutjs.com/).
3. Write code required to add a full-screen map to your page using the [Google Maps API] (https://developers.google.com/maps/).
4. Write code required to add map markers identifying a number of locations you are interested in within this neighborhood.
5. Implement the search bar functionality to search your map markers.
6. Implement a list view of the identified locations.
7. Add additional functionality using third-party APIs when a map marker, search result, or list view entry is clicked (ex. Yelp reviews, Wikipedia, StreetView/Flickr images, etc). If you need a refresher on making AJAX requests to third-party servers, check out our Intro to [AJAX course] (https://www.udacity.com/course/ud110-nd).

## Helpful Resources

1. [Zomato API] (https://developers.zomato.com).
2. [Google Maps] (https://developers.google.com/maps/documentation/).