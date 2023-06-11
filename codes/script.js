let apiKey = "AAPK7a92f5792213444fa35b303285d4cada_2YkgprN69XvEyD9__M9CKigH7leNMpC6ThjPxL9QJsXcPIO1xAtXoQDzo34_TCr";
// pathfinding tracking 
const basemapEnum = "ArcGIS:Navigation";

navigator.geolocation.getCurrentPosition(getPosition);

function getPosition(position) {
    console.log("longitude", position.coords.longitude, "latitude", position.coords.latitude);

    const map = new maplibregl.Map({
        container: "map", // the id of the div element
        style: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`,
        zoom: 12, // starting zoom

        center: [26.792958906534345, 87.29235546879934] // dharan
        // center: [position.coords.longitude, position.coords.latitude]
    });

    function addCircleLayers() {

        map.addSource("start", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: []
            }
        });
        map.addSource("end", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: []
            }
        });

        map.addLayer({
            id: "start-circle",
            type: "circle",
            source: "start",
            paint: {
                "circle-radius": 6,
                "circle-color": "white",
                "circle-stroke-color": "black",
                "circle-stroke-width": 2
            }
        });

        map.addLayer({
            id: "end-circle",
            type: "circle",
            source: "end",
            paint: {
                "circle-radius": 7,
                "circle-color": "black"
            }
        });

    }

    function addRouteLayer() {

        map.addSource("route", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: []
            }
        });

        map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",

            paint: {
                "line-color": "hsl(205, 100%, 50%)",
                "line-width": 4,
                "line-opacity": 0.6
            }
        });
    }

    // MARKS THE MARKER IN THE MAP
    function updateRoute() {
        const authentication = arcgisRest.ApiKeyManager.fromKey(apiKey);
        arcgisRest
            .solveRoute({
                stops: [startCoords, endCoords],
                endpoint: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve",
                authentication
            })

            .then((response) => {
                map.getSource("route").setData(response.routes.geoJson);

                const directionsHTML = response.directions[0].features.map((f) => f.attributes.text).join("<br/>");
                document.getElementById("directions").innerHTML = directionsHTML;

            })

        // .catch((error) => {
        //     console.log("error occured.");
        // });

    }

    map.on("load", () => {
        addCircleLayers();

        addRouteLayer();

    });

    let currentStep = "start";
    let startCoords, endCoords;

    // tracking stars here
    map.on("click", (e) => {
        if (currentStep === "start") {
            // FIRST MARK

            // let coordinates = [position.coords.longitude, position.coords.latitude];
            let coordinates = [26.792958906534345, 87.29235546879934]
            let point = {
                type: "Point",
                coordinates
            }

            map.getSource("start").setData(point);
            startCoords = coordinates;

            const empty = {
                type: "FeatureCollection",
                features: []
            };
            map.getSource("end").setData(empty);
            map.getSource("route").setData(empty);
            endCoords = null;
            currentStep = "end";
        // } else {
            let secondCoordinates = [26.811735609426133, 87.28524568251937]; // dharn clock tower location

            let secondPoint = {
                type: "Point",
                secondCoordinates
            }

            console.log(secondPoint)

            // SECOND MARK
            map.getSource("end").setData(secondPoint);
            endCoords = secondCoordinates;
            currentStep = "start";
        }

        if (startCoords && endCoords) {
            updateRoute(startCoords, endCoords);
        }

    });
}








// function locationCoords(position) {


//     map.on('click', function (e) {

//         if (currentStep === "start") {
//             let coordinates = [-79.4564135772704, 43.67431069053606];
//             // coordinates.push(position.coords.latitude, position.coords.longitude);  // gives the real location
//             const point = {
//                 type: "Point",
//                 coordinates
//             }
//             // FIRST MARK
//             map.getSource("start").setData(point);
//             startCoords = coordinates;
//             const empty = {
//                 type: "FeatureCollection",
//                 features: []
//             };
//             map.getSource("end").setData(empty);
//             map.getSource("route").setData(empty);
//             endCoords = null;
//             currentStep = "end";
//         } else {
//             let coordinates = [-80.4564135772704, 50.67431069053606];
//             // coordinates.push(position.coords.latitude, position.coords.longitude);  // gives the real location
//             const point = {
//                 type: "Point",
//                 coordinates
//             }

//             // SECOND MARK
//             map.getSource("end").setData(point);
//             console.log("")
//             endCoords = coordinates;
//             currentStep = "start";
//         }
//     });
//     // map.getSource("start").setData(point);
//     // startCoords = coordinates;
//     // const empty = {
//     //     type: "FeatureCollection",
//     //     features: []
//     // };
//     // map.getSource("end").setData(empty);
//     // map.getSource("route").setData(empty);
//     // endCoords = null;
//     // currentStep = "end";
// }
// temp ends