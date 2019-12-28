import React, { useState } from 'react';
import { Event, groupByTopic, EventTopic } from '../api/EventApi';
import { map, uniqueId } from 'lodash';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  ListGroup,
  ListGroupItem,
  Badge,
  Collapse,
} from 'reactstrap';
import TopicIcon from './TopicIcon';

export const DETAILS_PANEL_WIDTH = 360;

const TopicDetailList: React.FC<{ topic: EventTopic; events: Event[] }> = ({
  topic,
  events,
}) => {
  const [collapse, setCollapse] = useState(true);
  const toggle = () => setCollapse(!collapse);

  return (
    <>
      <Button
        block
        onClick={toggle}
        className="d-flex justify-content-between align-items-center"
      >
        <span>
          <TopicIcon topic={topic} />
          <span className="ml-1">{topic}</span>
        </span>
        <Badge color="light" pill>
          {events.length}
        </Badge>
      </Button>
      <Collapse isOpen={collapse}>
        <ListGroup flush>
          {map(events, ({ id }) => (
            <ListGroupItem key={id}>
              <small>{id}</small>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Collapse>
    </>
  );
};

const DetailsPanel: React.FC<{
  events: Event[];
  onClose: () => void;
}> = ({ events, onClose }) => {
  const eventsByTopic = groupByTopic(events);
  return (
    <Card
      className="h-100"
      style={{ zIndex: 1, width: `${DETAILS_PANEL_WIDTH}px` }}
    >
      <CardHeader>
        <span className="font-weight-bold">
          <Badge pill>{events.length}</Badge>
          <span className="ml-1">Events By Topic</span>
        </span>
        <Button close onClick={() => onClose()} />
      </CardHeader>
      <CardBody className="overflow-auto">
        {map(eventsByTopic, (events, topic: EventTopic) => (
          <TopicDetailList
            key={uniqueId(`${topic}-`)}
            topic={topic}
            events={events}
          />
        ))}
      </CardBody>
    </Card>
  );
};

export default DetailsPanel;
