import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";




let boxbound = 0
function AreaSelect() {

  const map = useMap();

  useEffect(() => {
    if (!map.selectArea) return;


    map.selectArea.enable();

    map.on("areaselected", (e) => {
      console.log(e.bounds.toBBoxString());
      L.rectangle(e.bounds, { color: "white", weight: -5, opacity: -5 }).addTo(map);

      boxbound = e.bounds

    });

    // You can restrict selection area like this:
    const bounds = map.getBounds().pad(-0.25); // save current map bounds as restriction area
    // check restricted area on start and move
    map.selectArea.setValidate((layerPoint) => {
      return bounds.contains(this._map.layerPointToLatLng(layerPoint));

    });

    // now switch it off
    map.selectArea.setValidate();
  }, []);

  return null;
}

export {
  AreaSelect,
  boxbound,
}