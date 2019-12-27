import {CompositeLayer} from '@deck.gl/core';
import {IconLayer} from '@deck.gl/layers';
import Supercluster from 'supercluster';
import { get } from 'lodash';

function getIconName(geoJsonFeature) {
  if(geoJsonFeature.properties.cluster) {
    return getClusterIconName(geoJsonFeature.properties.point_count);
  } else {
    return getEventIconName(geoJsonFeature.properties);
  }
}
function getClusterIconName(size) {
  if (size <= 1) {
    return '';
  }
  if (size < 10) {
    return `marker-${size}`;
  }
  if (size < 25) {
    return 'marker-10';
  }
  if (size < 100) {
    return `marker-${Math.floor(size / 25)*25}`;
  }
  if (size < 250) {
    return 'marker-100';
  }
  if (size < 1000) {
    return `marker-${Math.floor(size / 250)*250}`;
  }
  return 'marker-1000';
}

function getEventIconName(event) {
  return get(event, 'properties.tag.topic[0]', 'test');
}

function getIconSize(size) {
  return Math.min(100, size) / 100 + 1;
}

export default class IconClusterLayer extends CompositeLayer {
  shouldUpdateState({changeFlags}) {
    return changeFlags.somethingChanged;
  }

  updateState({props, oldProps, changeFlags}) {
    const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

    if (rebuildIndex) {
      const index = new Supercluster({minZoom: 0, maxZoom: 20, radius: props.sizeScale});
      index.load(
        props.data.map(d => ({
          geometry: {coordinates: props.getPosition(d)},
          properties: d
        }))
      );
      this.setState({index});
    }

    const z = Math.floor(this.context.viewport.zoom);
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z
      });
    }
  }

  getPickingInfo({info}) {
    const {object: geoJsonFeature} = info;
    let clusterInfo, clusterEvents, event;

    //ug... need stronger types for object
    if(geoJsonFeature && geoJsonFeature.properties) {
      if(geoJsonFeature.properties.cluster){
        clusterInfo = geoJsonFeature.properties;
        clusterEvents = this.state.index
          .getLeaves(clusterInfo.cluster_id, Infinity )
          .map(f => f.properties);
      } else {
        event = geoJsonFeature.properties;
      }
    }

    return {
      ...info,
      object: {
        clusterInfo,
        clusterEvents,
        event
      }
    }
  }

  renderLayers() {
    const {data} = this.state;
    const {iconAtlas, iconMapping, sizeScale} = this.props;

    return new IconLayer(
      this.getSubLayerProps({
        id: 'icon',
        data,
        iconAtlas,
        iconMapping,
        sizeScale,
        getPosition: d => d.geometry.coordinates,
        getIcon: d => getIconName(d),
        getSize: d => getIconSize(d.properties.cluster ? d.properties.point_count : 1)
      })
    );
  }
}
