import * as React from 'react';

import { BcsIconButton } from '@bcs/library';
import { shallow } from 'enzyme';
import { identity } from 'fp-ts/lib/function';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import { CustomMarkupView } from '.';

window.open = jest.fn().mockImplementationOnce(() => {
  return {
    document: {
      write(_message: string) { },
      close() { },
    },
  };
});

const markup = () => <CustomMarkupView message='phone' classes={{}} theme={null}><span /></CustomMarkupView>;
const createJson = () => renderer.create(
  markup(),
  { createNodeMock: identity }, // YB: See https://github.com/facebook/react/issues/7740#issuecomment-247335106
).toJSON();

describe('Section', () => {
  it.concurrent('Should render according to the snapshot', async () => {
    const output: ReactTestRendererJSON = createJson();
    expect(output).toMatchSnapshot();
  });

  it.concurrent('it handle click on icon', async () => {
    const wrapper = shallow(markup());
    wrapper.find(BcsIconButton).simulate('click');
    expect(window.open).toHaveBeenCalled();
  });
});
