import React, { useState } from 'react';
import { render } from 'react-dom';
import DetailsPanel, { DETAILS_PANEL_WIDTH } from './components/DetailsPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import Map from './components/map';
import { Event } from './api/EventApi';

const App: React.FC = () => {
  const [detailEvents, setDetailEvents] = useState<Event[] | null>(null);
  const [xOffSet, setXOffset] = useState(0);
  return (
    <>
      {detailEvents && (
        <DetailsPanel
          events={detailEvents}
          onClose={() => {
            setDetailEvents(null);
            setXOffset(0);
          }}
        />
      )}
      <Map
        xOffset={xOffSet}
        onClick={(events: Event[]) => {
          setDetailEvents(events);
          setXOffset(DETAILS_PANEL_WIDTH);
        }}
      />
    </>
  );
};

export function renderToDOM(container: any) {
  render(<App />, container);
}
