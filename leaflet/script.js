let map = L.map("map").setView([33.684422, 73.047882], 11);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let marker = L.marker([33.7295, 73.0372]).addTo(map);
let markerMon = L.marker([33.6931, 73.0689]).addTo(map);

let circle = L.circle([33.5565, 72.8341], {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 1000,
}).addTo(map);

marker
  .bindPopup("<b>This is faisal masjid, the largest mosque in south asia</b>")
  .openPopup();
circle.bindPopup("Islambad international airport");
markerMon.bindPopup("<b>Pakistan Monument</b>").openPopup();
