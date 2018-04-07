// @flow

import ActionTypes from './ActionTypes';

export function trackScreenView(payload) {
  return {
    type: ActionTypes.GOOGLE_ANALYTICS_TRACKER_TRACK_SCREEN_VIEW,
    payload,
  };
}

export function trackEvent(payload) {
  return {
    type: ActionTypes.GOOGLE_ANALYTICS_TRACKER_TRACK_EVENT,
    payload,
  };
}
