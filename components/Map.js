import React, {Component} from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';

import IconClusterLayer from './IconClusterLayer';
import { loadEvents } from '../api/EventApi';
import HoverPopup from './HoverPopup';
import { uniqueId } from 'lodash';

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
export default class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      hoveredObject: null,
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
    const {onClick} = this.props;
    const {object} = info;

    if (object && object.clusterEvents) {
      onClick(object.clusterEvents);
      this._closePopup();
    }
  }

  _closePopup() {
    if (this.state.hoveredObject) {
      this.setState({hoveredObject: null});
    }
  }

  _renderhoveredItems() {
    const { xOffset } = this.props;
    const {x, y, hoveredObject} = this.state;

    if (!hoveredObject) {
      return null;
    }
    const {clusterInfo, clusterEvents, event} = hoveredObject;

    if(!event && !clusterInfo) {
      return null;
    }

    return <HoverPopup
      key={uniqueId('hover-')}
      x={x - xOffset}
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

    const layer =
      new IconClusterLayer({...layerProps, id: 'icon-cluster', sizeScale: 60})

    return [layer];
  }

  render() {
    const {mapStyle = 'mapbox://styles/mapbox/light-v10', xOffset} = this.props;

    return (
      <DeckGL
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{dragRotate: false}}
        onClick={this._onClick}
      >
        <MapView id="map" x={xOffset} >
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
     );
  }
}
