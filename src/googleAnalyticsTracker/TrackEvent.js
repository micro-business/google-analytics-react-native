// @flow

import { ConfigReader } from '@microbusiness/common-react-native';
import { AsyncStorage } from 'react-native';
import { call, takeEvery } from 'redux-saga/effects';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
import ActionTypes from './ActionTypes';

function* trackEventAsync(action) {
  try {
    let configReader;

    try {
      const environment = yield call(AsyncStorage.getItem, '@global:environment');

      configReader = new ConfigReader(environment ? environment : ConfigReader.getDefaultEnvironment());
    } catch (exception) {
      configReader = new ConfigReader();
    }

    const googleAnalyticsTrackingId = configReader.getGoogleAnalyticsTrackingId();

    if (!googleAnalyticsTrackingId) {
      return;
    }

    const tracker = new GoogleAnalyticsTracker(googleAnalyticsTrackingId);

    if (action.payload.has('optionalValues')) {
      const optionalValues = action.payload.get('optionalValues');

      tracker.trackEvent(action.payload.get('category'), action.payload.get('action'), {
        label: optionalValues.get('label'),
        value: optionalValues.get('value'),
      });
    } else {
      tracker.trackEvent(action.payload.get('category'), action.payload.get('action'));
    }
  } catch (exception) {} // eslint-disable-line no-empty
}

export default function* watchTrackEvent() {
  yield takeEvery(ActionTypes.GOOGLE_ANALYTICS_TRACKER_TRACK_EVENT, trackEventAsync);
}
