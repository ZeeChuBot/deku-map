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

const PointHoverInfo: React.FC<{
  event: Event;
}> = ({ event }) => {
  return (
    <>
      <CardHeader>
        <span className="font-weight-bold">ID:</span> {event.id}
      </CardHeader>
      <CardBody>
        {map(event.properties.tag.topic, topic => (
          <div key={`${event.id}-${topic}`}>
            <TopicIcon topic={topic} />
            <span className="mx-1">{topic}</span>
          </div>
        ))}
      </CardBody>
    </>
  );
};

const ClusterHoverInfo: React.FC<{
  clusterInfo: ClusterInfo;
  events: Event[];
}> = ({ clusterInfo, events }) => {
  const eventsByTopic = groupByTopic(events);
  return (
    <>
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
    </>
  );
};

const HoverPopup: React.FC<{
  x: number;
  y: number;
  event?: Event;
  events?: Event[];
  clusterInfo?: ClusterInfo;
}> = ({ x, y, event, events, clusterInfo }) => {
  return (
    <Card inverse color="dark" className="w-25" style={{ left: x, top: y }}>
      {event && <PointHoverInfo event={event} />}
      {clusterInfo && events && (
        <ClusterHoverInfo clusterInfo={clusterInfo} events={events} />
      )}
    </Card>
  );
};

export default HoverPopup;
