// @flow

import { ConfigReader } from '@microbusiness/common-react-native';
import { AsyncStorage } from 'react-native';
import { select, call, takeEvery } from 'redux-saga/effects';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
import ActionTypes from './ActionTypes';

const getUserAccess = state => state.userAccess;

function* trackScreenViewAsync(action) {
  try {
    const userAccess = yield select(getUserAccess);

    if (!userAccess.get('userExists')) {
      return;
    }

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

    const tracker = new GoogleAnalyticsTracker(googleAnalyticsTrackingId, {
      userId: 1,
      username: 2,
      emailAddress: 3,
      emailAddressVerified: 4,
    });
    const userInfo = userAccess.get('userInfo');

    tracker.trackScreenViewWithCustomDimensionValues(action.payload.get('screenName'), {
      userId: userInfo.get('id'),
      username: userInfo.get('username'),
      emailAddress: userInfo.get('emailAddress'),
      emailAddressVerified: userInfo.get('emailAddressVerified'),
    });
  } catch (exception) {} // eslint-disable-line no-empty
}

export default function* watchTrackScreenView() {
  yield takeEvery(ActionTypes.GOOGLE_ANALYTICS_TRACKER_TRACK_SCREEN_VIEW, trackScreenViewAsync);
}
