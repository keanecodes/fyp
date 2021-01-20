import {MapboxLayer} from '@deck.gl/mapbox';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import {DataFilterExtension} from '@deck.gl/extensions';
// import resale1k from "data/resale_1k.csv"
// import {load} from '@loaders.gl/core';
// import {CSVLoader} from '@loaders.gl/csv';

export async function renderDeckglLayers(map, data) {

  // const data = await load(resale1k, CSVLoader)
  // console.log(data)

  const heatmap = new MapboxLayer({
    id: 'heat',
    type: HeatmapLayer,
    data: data,
    getPosition: d => [d.longitude, d.latitude],
    getWeight: d => d.resale_price,
    radiusPixels: 60,
  });

  const hexagon = new MapboxLayer({
    id: 'hex',
    type: HexagonLayer,
    data: data,
    getPosition: d => [d.longitude, d.latitude],
    getElevationWeight: d => d.resale_price,
    elevationScale: 80,
    extruded: true,
    radius: 509,         
    opacity: 0.6,        
    coverage: 0.88,
    lowerPercentile: 50,
    transitions: {
      elevationScale: 1000
    }
});



  if(!map.getLayer('heat')) map.addLayer(heatmap);
  if(!map.getLayer('hex'))map.addLayer(hexagon);
  
}

// eslint-disable-next-line
function getFirstLabelLayerId(style) {
  const layers = style.layers;
  // Find the index of the first symbol (i.e. label) layer in the map style
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol') {
      return layers[i].id;
    }
  }
  return undefined;
}

// function getTooltip({object}) {
//   return (
//     object &&
//     `\
//     Time: ${new Date(object.timestamp).toUTCString()}
//     Magnitude: ${object.magnitude}
//     Depth: ${object.depth}
//     `
//   );
// }

export function addScatterTimeline(data, map, filterValue) {

  const dataFilter = new DataFilterExtension({
    filterSize: 1,
    // Enable for higher precision, e.g. 1 second granularity
    // See DataFilterExtension documentation for how to pick precision
    fp64: false
  });
  console.log(data)
  const scatter = new MapboxLayer({
    id: 'scatter',
    type: ScatterplotLayer,
    data: data,
    opacity: 0.8,
    radiusScale: 100,
    radiusMinPixels: 1,
    wrapLongitude: true,
  
    getPosition: d => [d.longitude, d.latitude, -d.depth * 1000],
    getRadius: d => Math.pow(2, d.magnitude),
    getFillColor: d => {
      const r = Math.sqrt(Math.max(d.depth, 0));
      return [255 - r * 15, r * 5, r * 10];
    },
  
    getFilterValue: d => d.timestamp,
    filterRange: [filterValue[0], filterValue[1]],
    filterSoftRange: [
      filterValue[0] * 0.9 + filterValue[1] * 0.1,
      filterValue[0] * 0.1 + filterValue[1] * 0.9
    ],
    extensions: [dataFilter],
    pickable: true
  });

  if(!map.getLayer('scatter'))map.addLayer(scatter);
}

