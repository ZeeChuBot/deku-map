import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {IconLayer} from '@deck.gl/layers';
import { MapView } from '@deck.gl/core';

import IconClusterLayer from './icon-cluster-layer';
import { loadEvents } from './api/EventApi';
import HoverPopup from './components/HoverPopup';
import { uniqueId } from 'lodash';
import DetailsPanel, { DETAILS_PANEL_WIDTH } from './components/DetailsPanel';
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
      expandedObjects: null
    };
    this._onHover = this._onHover.bind(this);
    this._onClick = this._onClick.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._renderhoveredItems = this._renderhoveredItems.bind(this);
  }

  _onHover(info) {
    const {x, y, object} = info;
    this.setState({x, y, hoveredObject: object});
  }

  _onClick(info) {
    const {showCluster = true} = this.props;
    const {x, y, object} = info;

    if (showCluster && object && object.clusterEvents) {
      this.setState({x, y, expandedObjects: object.clusterEvents});
    }
  }

  _closePopup() {
    if (this.state.expandedObjects) {
      this.setState({expandedObjects: null, hoveredObject: null});
    }
  }

  _renderhoveredItems() {
    const {x, y, hoveredObject, expandedObjects} = this.state;

    if (!hoveredObject) {
      return null;
    }
    const {clusterInfo, clusterEvents, event} = hoveredObject;

    if(!event && !clusterInfo) {
      return null;
    }

    return <HoverPopup
      key={uniqueId('hover-')}
      x={expandedObjects ? x - DETAILS_PANEL_WIDTH: x}
      y={y}
      clusterInfo={clusterInfo}
      event={event}
      events={clusterEvents} />
  }

  _renderLayers() {
    const {
      data = DATA_URL,
      iconMapping = 'data/deku-icon-mapping.json',
      iconAtlas = 'data/deku-icon-atlas.png',
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
    const {mapStyle = 'mapbox://styles/mapbox/light-v10'} = this.props;

    return (
      <>
      {this.state.expandedObjects && <DetailsPanel events={this.state.expandedObjects} onClose={this._closePopup}/>}
      <DeckGL
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{dragRotate: false}}
        onClick={this._onClick}
      >
        <MapView id="map" x={this.state.expandedObjects ? `${DETAILS_PANEL_WIDTH}px` : 0}>
          <StaticMap
            key="deku-map"
            reuseMaps
            mapStyle={mapStyle}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </MapView>

        {this._renderhoveredItems}
      </DeckGL>
      </>
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
