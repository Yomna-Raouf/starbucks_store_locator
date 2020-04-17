var map;
var markers = [];
var infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: 34.063380,
        lng: -118.358080
    },
    zoom: 8,
    MapTypeId: "ROADMAP",
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

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

function setOnClickListener() {
    var storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach(function(element, index) {
        element.addEventListener('click', function(){
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

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    for(var [index,store] of stores.entries()) { 
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        var name = store["name"];
        var address = store["addressLines"][0];
        var openStatus = store["openStatusText"];
        var phoneNumber = store["phoneNumber"];
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatus, phoneNumber, ++index);
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address,openStatus, phoneNumber, index) {
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
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
     // label: index.toString(),
      icon:"pin-6-48.ico"
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    }); 
    markers.push(marker);
}

