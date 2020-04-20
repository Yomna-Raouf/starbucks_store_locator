var marker = [];

 
    displayStores(stores);
    mapboxgl.accessToken = 'pk.eyJ1IjoieW9tbmEtcmFvdWYiLCJhIjoiY2s5MnY1MTJqMDNqMTNkdXJvbTEybm9jNiJ9.Ptr2DKynFUQVoaNYN-6uqA';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [ -118.358080, 34.063380 ], // starting position
        zoom: 9 // starting zoom
    });
      
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
    showStoresMarkers(map);

   /* map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: 34.063380,
        lng: -118.358080
    },
    zoom: 8,
    MapTypeId: "ROADMAP",
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();*/


function searchStores() {
    var fouundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
        for(var store of stores) {
            var postal = store['address']['postalCode'].substring(0, 5);
            if(postal === zipCode ) {
                fouundStores.push(store);
            }
         }
    } else {
        fouundStores = stores;
    } 
    clearLocations();
    displayStores(fouundStores);
    showStoresMarkers(fouundStores);
    setOnClickListener();
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function flyToStore(currentFeature) {
  map.flyTo({
    center: lnglat,
    zoom: 15
  });
}

function setOnClickListener() {
    var storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach(function(element, index) {
        element.addEventListener('click', function(){
            flyToStore(); //adding lnglat map.flyTo({center: [Lat, Lng]})
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}

function displayStores(stores) {
    var storesHtml = '';
    for(var [index,store] of stores.entries()) {
        var address = store['addressLines'];
        var phone = store['phoneNumber'];

        storesHtml+= `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${address[0]}</span> 
                            <span>${address[1]} </span> 
                        </div>
                        <div class="store-phone-number">
                            ${phone}
                        </div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${++index}
                        </div>
                    </div>
                </div>
            </div>
        `
        document.querySelector('.store-list').innerHTML = storesHtml;
    }
}

function showStoresMarkers(map) {
    var bounds = new mapboxgl.LngLatBounds();
    for(var [index,store] of stores.entries()) { 
        var lnglat = [
            store["coordinates"]["longitude"],
            store["coordinates"]["latitude"]
        ];  
        var name = store["name"];
        var address = store["addressLines"][0];
        var openStatus = store["openStatusText"];
        var phoneNumber = store["phoneNumber"];
        bounds.extend(lnglat);
        map.fitBounds(bounds);
        createMarker(map, lnglat, name, address, openStatus, phoneNumber, ++index);
    }   
} 

function createMarker(map, lnglat, name, address,openStatus, phoneNumber, index) {
    var html = `
        <div class="store-info-window">
                <div class="store-info-info">
                    <div class="starbucks">
                        <img src="starbucks.png" alt="" >
                    </div>
                    <div class="store-info-name-status">
                        <div class="store-info-name">
                            ${name}
                        </div>
                        <div class="store-info-status">
                            ${openStatus}
                        </div>
                    </div>  
                </div>    
                <div class="store-info-address">
                    <div class="circle">
                        <i class="fas fa-location-arrow"></i>
                    </div> 
                    ${address}
                </div>
                <div class="store-info-phone">
                    <div class="circle">
                        <i class="fas fa-phone-alt" onclick="window.location='tel:${phoneNumber}';"></i>
                    </div>
                    ${phoneNumber}
                </div>
        </div>
    `;
   
     var popup = new mapboxgl.Popup({ closeOnClick: true })
    .setHTML(html)
    .addTo(map);

    var marker = new mapboxgl.Marker({
            color:"green",
        })
        .setLngLat(lnglat)
        .setPopup(popup)
        .addTo(map);
}

