import { shallow } from 'enzyme';
import React from 'react';
import rename-me from '../rename-me';

const InsideDiv = renderProps => (
  <div>{renderProps}</div>
);

const TestItem = (
  <rename-me
    render={renderProps => (
      <InsideDiv {...renderProps} />
    )}
  />
);

describe('rename-me', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(TestItem);
  });

  it('Renders something', () => {
    expect(wrapper.find('InsideDiv').length).toBe(1);
  });
  it('Returns "rename-me" state', () => {
    expect(wrapper.state().rename-me).toBe(false);
    wrapper.instance().handleTrue();
    expect(wrapper.state().rename-me).toBe(true);
    wrapper.instance().handleFalse();
    expect(wrapper.state().rename-me).toBe(false);
    wrapper.instance().handlerename-me();
    expect(wrapper.state().rename-me).toBe(true);
  });
});
