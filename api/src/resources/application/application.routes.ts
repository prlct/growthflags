import { routeUtil } from 'utils';

import createFeature from './actions/create-feature';
import getApplication from './actions/get-application';
import getFeatures from './actions/get-features';
import createPipeline from './actions/create-pipeline';
import createSequence from './actions/create-sequence';
import createSequenceEmail from './actions/create-sequence-email';
import addPipelineUsers from './actions/add-pipeline-users';
import getEvents from './actions/get-events';
import createEvent from './actions/create-event';

const privateRoutes = routeUtil.getRoutes([
  createFeature,
  createPipeline,
  createSequence,
  createSequenceEmail,
  getApplication,
  getFeatures,
  addPipelineUsers,
  getEvents,
  createEvent,
]);

export default {
  privateRoutes,
};
