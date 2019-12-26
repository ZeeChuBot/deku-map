import React from 'react';
import { Event, groupByTopic, EventTopic } from '../api/EventApi';
import { map } from 'lodash';
import { Card, CardHeader, CardBody, CardSubtitle } from 'reactstrap';
import TopicIcon from './TopicIcon';

//TODO: work in types for @types/supercluster

type ClusterInfo = {
  cluster: boolean;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: number;
};

const HoverPopup: React.FC<{
  clusterInfo: ClusterInfo;
  x: number;
  y: number;
  events: Event[];
}> = ({ clusterInfo, x, y, events }) => {
  const eventsByTopic = groupByTopic(events);

  return (
    <Card inverse color="dark" className="w-25" style={{ left: x, top: y }}>
      <CardHeader>
        <h5>{clusterInfo.point_count} events</h5>
        <CardSubtitle className="font-italic">
          (click on point for more details)
        </CardSubtitle>
      </CardHeader>
      <CardBody>
        {map(eventsByTopic, (events, topic: EventTopic) => (
          <div className="my-2" key={`${clusterInfo.cluster_id}-${topic}`}>
            <TopicIcon topic={topic} />
            <span className="ml-1">
              {topic} : {events.length}
            </span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default HoverPopup;
