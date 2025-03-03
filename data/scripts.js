   // Initialize the map
   var map = L.map('dotmap', {
    crs: L.CRS.EPSG3857 
   }).setView([44.1,-121.1], 7); // Center of the map at these coordinates with zoom level 7

   // Add a tile layer (this is ESRI satellite tiles)
   L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
       attribution: '&copy; <a href="https://www.esri.com/en-us/legal/terms/data-attributions"> ESRI Satellite Imagery</a> contributors'
   }).addTo(map);

function calcPropRadius(attValue) { //this is an arbitrary function for radius based on aesthetics
    var radius = Math.sqrt(attValue)/8
    return radius;
}

function colorchooser(attValue) { //this selects color based on the attValue
    if (attValue <= 1000) {
        return "#2ac129";
    }
    else if (attValue <= 1500) {
        return "#cbe808";
    }
    else if (attValue <= 2500){
        return "#e85808";
    }
    else {
        return "red";
    }
}


function createPropSymbols(data){ //this defines the generic symbol properties
    var geojsonMarkerOptions = {
        radius: 8,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    

    var attribute = "Barrier_size_index" //sets up the symbol generation from attributes

    L.geoJson(data, { //adds the geojson to the map 
        crs: L.CRS.EPSG3857,
        pointToLayer: function (feature, latlng) {
            var attValue = Number(feature.properties[attribute]); //defines the scaling field

            if (attValue == 0) { //added this to get rid of points with value of 0, might come back to add no data symbol
                return null;
            }
            console.log(feature.properties, attValue); //returns for debugging 
            geojsonMarkerOptions.radius = calcPropRadius(attValue); //calculates scaling radii
            geojsonMarkerOptions.fillColor = colorchooser(attValue);// picks the color
            return L.circleMarker(latlng, geojsonMarkerOptions); //puts them on the map
        }
    }).addTo(map); //adds the geojson object to the map
};

fetch('data/fed_fpb.geojson') // this loads in the geojson that was referenced above
.then(response => response.json())
.then(data => {
    // Add the GeoJSON to the map
    createPropSymbols(data);
    console.log(data.features.length)
    var fpb = data;
})
.catch(error => {
    console.error("Error loading GeoJSON: ", error);
});

//now the cholopleth

  // Initialize the map
  var map2 = L.map('chloropleth', {
    crs: L.CRS.EPSG3857 
   }).setView([44.1,-121.1], 7); // Center of the map at these coordinates with zoom level 7

   // Add a tile layer (this is OpenStreetMap tiles)
   L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
       attribution: '&copy; <a href="https://www.esri.com/en-us/legal/terms/data-attributions"> ESRI Satellite Imagery</a> contributors'
   }).addTo(map2);

   //Need to create join point counts to a county polygon layer

   // Fetch counties first
   fetch('data/Oregon_counties.geojson')  // Load the counties GeoJSON file
   .then(response => response.json())
   .then(countiespoly => {
       // Create the counties polygons layer
       var counties = countiespoly
       L.geoJson(counties).addTo(map2);
       // Now fetch the fpb GeoJSON data
       return fetch('data/fed_fpb.geojson');
   })
   .then(response => response.json())  // Handle the fpb GeoJSON response
   .then(fpbData => {
       // Create the fpb point layer
       var fpb = fpbData

       L.geoJson(fpb).addTo(map2);
       
   });
   
       
   


   //

   
