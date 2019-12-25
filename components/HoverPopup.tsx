import React from 'react';
import { Event, groupByTopic } from '../api/EventApi';
import { map } from 'lodash';

//TODO: work in types for @types/supercluster

type ClusterInfo = {
  cluster: boolean;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: number;
}


const HoverPopup: React.FC<{ clusterInfo: ClusterInfo, x: number, y: number, events: Event[] }> =
  ({ clusterInfo, x, y, events }) => {
    const eventsByTopic = groupByTopic(events);

    return (
      <div className="tooltip" style={{ left: x, top: y }}>
        <h4>{clusterInfo.point_count} records</h4>
        {map(eventsByTopic, (events, topic) =>
          <h5 key={`${clusterInfo.cluster_id}-${topic}`}>{topic} : {events.length}</h5>)}
      </div>
    );
  }

export default HoverPopup;
