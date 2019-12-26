import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {IconLayer} from '@deck.gl/layers';

import IconClusterLayer from './icon-cluster-layer';
import { loadEvents, groupByTopic } from './api/EventApi';
import HoverPopup from './components/HoverPopup';
import { uniqueId } from 'lodash';
import DetailsPopover from './components/DetailsPopover';
import 'bootstrap/dist/css/bootstrap.min.css';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const DATA_URL = loadEvents();

const INITIAL_VIEW_STATE = {
  longitude: -35,
  latitude: 36.7,
  zoom: 1.8,
  maxZoom: 20,
  pitch: 0,
  bearing: 0
};

/* eslint-disable react/no-deprecated */
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      hoveredObject: null,
      expandedObjects: null,
      raw: null
    };
    this._onHover = this._onHover.bind(this);
    this._onClick = this._onClick.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._renderhoveredItems = this._renderhoveredItems.bind(this);
  }

  _onHover(info) {
    if (this.state.expandedObjects) {
      return;
    }

    // console.log('info', info);
    const {x, y, object, objects} = info;
    this.setState({x, y, hoveredObject: object, raw: objects});
  }

  _onClick(info) {
    const {showCluster = true} = this.props;
    const {x, y, objects, object} = info;

    if (object && showCluster) {
      this.setState({x, y, expandedObjects: objects || [object]});
    } else {
      this._closePopup();
    }
  }

  _closePopup() {
    if (this.state.expandedObjects) {
      this.setState({expandedObjects: null, hoveredObject: null});
    }
  }

  _renderhoveredItems() {
    const {x, y, hoveredObject, expandedObjects, raw} = this.state;


    if (expandedObjects) {
      return <DetailsPopover key={uniqueId()} x={x} y={y} events={expandedObjects} />
    }

    if (!hoveredObject) {
      return null;
    }
    return hoveredObject.cluster ?
      raw && <HoverPopup key={hoveredObject.cluster_id} clusterInfo={hoveredObject} x={x} y={y} events={raw} />
       : (
      <div key={hoveredObject.id} className="tooltip" style={{left: x, top: y}}>
        <h5>
          {hoveredObject.id} : {hoveredObject.properties.tag.topic.join(', ')}
        </h5>
      </div>
    );
  }

  _renderLayers() {
    const {
      data = DATA_URL,
      iconMapping = 'data/location-icon-mapping.json',
      iconAtlas = 'data/location-icon-atlas.png',
      showCluster = true
    } = this.props;

    const layerProps = {
      data,
      pickable: true,
      wrapLongitude: true,
      getPosition: d => d.geometry.coordinates,
      iconAtlas,
      iconMapping,
      onHover: this._onHover
    };

    const layer = showCluster
      ? new IconClusterLayer({...layerProps, id: 'icon-cluster', sizeScale: 60})
      : new IconLayer({
          ...layerProps,
          id: 'icon',
          getIcon: d => 'marker',
          sizeUnits: 'meters',
          sizeScale: 2000,
          sizeMinPixels: 6
        });

    return [layer];
  }

  render() {
    const {mapStyle = 'mapbox://styles/mapbox/dark-v9'} = this.props;

    return (
      <DeckGL
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{dragRotate: false}}
        onViewStateChange={this._closePopup}
        onClick={this._onClick}
      >
        <StaticMap
          key="deku-map"
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />

        {this._renderhoveredItems}
      </DeckGL>
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
