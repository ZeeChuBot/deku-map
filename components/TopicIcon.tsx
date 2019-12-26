import React from 'react';
import { EventTopic } from '../api/EventApi';
import OutdoorGrillOutlinedIcon from '@material-ui/icons/OutdoorGrillOutlined';
import LocalActivityOutlinedIcon from '@material-ui/icons/LocalActivityOutlined';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import BathtubOutlinedIcon from '@material-ui/icons/BathtubOutlined';
import StarsOutlinedIcon from '@material-ui/icons/StarsOutlined';
import CollectionsOutlinedIcon from '@material-ui/icons/CollectionsOutlined';
import NewReleasesOutlinedIcon from '@material-ui/icons/NewReleasesOutlined';
import RadioOutlinedIcon from '@material-ui/icons/RadioOutlined';
import SupervisedUserCircleOutlinedIcon from '@material-ui/icons/SupervisedUserCircleOutlined';
import LocalHospitalOutlinedIcon from '@material-ui/icons/LocalHospitalOutlined';
import ChangeHistoryOutlinedIcon from '@material-ui/icons/ChangeHistoryOutlined';
import DirectionsBoatOutlinedIcon from '@material-ui/icons/DirectionsBoatOutlined';
import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';
import WhatshotOutlinedIcon from '@material-ui/icons/WhatshotOutlined';

const TopicIcon: React.FC<{
  topic: EventTopic;
}> = ({ topic }) => {
  switch (topic) {
    case 'test':
      return <OutdoorGrillOutlinedIcon />;
    case 'issue_activity':
      return <LocalActivityOutlinedIcon />;
    case 'supply chain':
      return <LocalShippingOutlinedIcon />;
    case 'military non-conflict':
      return <BathtubOutlinedIcon />;
    case 'outlier':
      return <StarsOutlinedIcon />;
    case 'collection':
      return <CollectionsOutlinedIcon />;
    case 'disaster':
      return <NewReleasesOutlinedIcon />;
    case 'radio wave':
      return <RadioOutlinedIcon />;
    case 'refugee':
      return <SupervisedUserCircleOutlinedIcon />;
    case 'outbreak':
      return <LocalHospitalOutlinedIcon />;
    case 'change detection':
      return <ChangeHistoryOutlinedIcon />;
    case 'maritime':
      return <DirectionsBoatOutlinedIcon />;
    case 'energy':
      return <OfflineBoltOutlinedIcon />;
    case 'conflict':
      return <WhatshotOutlinedIcon />;
    default:
      return <OutdoorGrillOutlinedIcon />;
  }
};

export default TopicIcon;
