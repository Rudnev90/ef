
import * as React from 'react';

import { cleanup, render } from '@testing-library/react';
import renderer from 'react-test-renderer';
afterEach(cleanup);

import { ActivityDetailsSkeleton } from '.';

const ACTIVITY_DETAIL_SKELETON_BCS_ID = 'activity-details-skeleton';

describe('ActivityDetailsSkeleton', () => {
  it.concurrent('ActivityDetailsSkeleton render ok', async () => {
    const output = renderer.create(<ActivityDetailsSkeleton classes={{}} />);
    expect(output.toJSON()).toMatchSnapshot();
  });

  it.concurrent(`should have argument data-bcs-id="${ACTIVITY_DETAIL_SKELETON_BCS_ID}"`, async () => {
    const { getByTestId } = render(<ActivityDetailsSkeleton classes={{}} />);
    expect(getByTestId(ACTIVITY_DETAIL_SKELETON_BCS_ID)).toBeTruthy();
  });
});
