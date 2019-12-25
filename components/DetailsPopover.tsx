import React from 'react';
import { Event, groupByTopic } from '../api/EventApi';
import { map, uniqueId } from 'lodash';

const DetailsPopover: React.FC<{ x: number, y: number, events: Event[] }> =
  ({ x, y, events }) => {
    const eventsByTopic = groupByTopic(events);

    return (
      <div className="tooltip interactive" style={{ left: x, top: y }}>
        {map(eventsByTopic, (events, topic) =>
          <div key={uniqueId(`${topic}-`)}>
            <h4>{topic} : {events.length}</h4>
            {map(events, ({ id }) =>
              <div key={id}>{id}</div>
            )}
          </div>
        )}
      </div>
    );
  }

export default DetailsPopover;
