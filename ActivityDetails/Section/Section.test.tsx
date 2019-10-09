import * as React from 'react';

import { identity } from 'fp-ts/lib/function';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import { Section, SectionProps } from '.';

const createJson = (props: SectionProps) => renderer.create(
  <Section {...props} />,
  { createNodeMock: identity }, // YB: See https://github.com/facebook/react/issues/7740#issuecomment-247335106
).toJSON();

describe('Section', () => {
  it.concurrent('Should render according to the snapshot', async () => {
    const output: ReactTestRendererJSON = createJson({ icon: 'phone', classes: {}, theme: null });
    expect(output).toMatchSnapshot();
  });

  it.concurrent('Should render with direaction column', async () => {
    const output: ReactTestRendererJSON = createJson({ icon: 'phone', classes: {}, theme: null, direction: 'column' });
    expect(output).toMatchSnapshot();
  });
});
