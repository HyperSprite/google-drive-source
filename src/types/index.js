import {
  any,
  arrayOf,
  bool,
  func,
  object,
  oneOfType,
  number,
  shape,
  string,
} from 'prop-types';

export { default as dProps } from './dProps';

const types = {};
/** classes from material-ui/styles withStyle */
types.classes = object;
/** render as prop function */
types.render = func;

export default types;
