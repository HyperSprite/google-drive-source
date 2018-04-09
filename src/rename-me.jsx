import React from 'react';
import types, { dProps } from './types';
/**
* returns prop: rename-me = true || false;
* handleFalse: this.handleFalse, // always sets to false
* handleTrue: this.handleTrue, // always sets to true
* handlerename-me: this.handlerename-me, // rename-mes last value
*/
class rename-meState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rename-me: false,
    };
    this.handleTrue = this.handleTrue.bind(this);
    this.handleFalse = this.handleFalse.bind(this);
  }

  handleTrue() {
    this.setState({ rename-me: true });
  }

  handleFalse() {
    this.setState({ rename-me: false });
  }

  render() {
    return this.props.render({
      handleFalse: this.handleFalse,
      handleTrue: this.handleTrue,
      rename-me: this.state.rename-me,
    });
  }
}

rename-meState.propTypes = {
  // eslint-disable-next-line react/no-typos
  render: types.render.isRequired,
};

rename-meState.defaultProps = {
  ...dProps.rename-meState,
};

export default rename-meState;
