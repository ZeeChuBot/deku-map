import axios from 'axios';

export type UUID = string;

export type EventType =
  | 'radio frequency'
  | 'correlation'
  | 'narrative'
  | 'imagery'
  | 'collection'
  | 'site proximate'
  | 'signal'
  | 'beta'
  | 'platform';

export type EventTopic =
  | 'test'
  | 'issue_activity'
  | 'supply chain'
  | 'military non-conflict'
  | 'outlier'
  | 'collection'
  | 'disaster'
  | 'radio wave'
  | 'refugee'
  | 'outbreak'
  | 'change detection'
  | 'maritime'
  | 'energy'
  | 'conflict';

export type EventContext = 'twitter' | 'groundPhotos';

export type Event = {
  geometry: GeoJSON.Point;
  id: UUID;
  properties: {
    tag: {
      topic: EventTopic[];
    };
  };
};

export type TimeInMs = number;

export type EventApiResult = {
  totalItems: number;
  limit: number;
  searchAfter: [TimeInMs, UUID]; //maybe?
  count: number;
  restriction: {
    region: any[];
    type: EventType[];
    topic: EventTopic[];
    context: EventContext[];
  };
  items: Event[];
};

export const loadEvents = () => {
  return axios
    .get<EventApiResult>('data/events.json')
    .then(response => response.data.items);
};

export const groupByTopic = (events: Event[]) => {
  let eventByTopics = {} as Record<EventTopic, Event[]>;

  events.forEach(event => {
    event.properties.tag.topic.forEach(topic => {
      if (!eventByTopics[topic]) {
        eventByTopics[topic] = [];
      }
      eventByTopics[topic].push(event);
    });
  });

  return eventByTopics;
};
