
import * as React from 'react';

import renderer from 'react-test-renderer';

import { ActivityTabLoader } from '.';

describe('ActivityTabLoader', () => {
  it.concurrent('ActivityTabLoader render ok', async () => {
    const output = renderer.create(<ActivityTabLoader classes={{}} theme={null} />).toJSON();
    expect(output).toMatchSnapshot();
  });
});
