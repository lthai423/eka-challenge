const initialState = {
  'name': 'John Doe',
  'broker': 'EKA',
  'mc_num': 12341234,
  'dot_num': 12341234,
  'singleOp': true
};

export default function reducer(state = initialState, action = {}) {
  switch (action.field) {
    case 'name':
      return {
        ...state,
        name: action.value
      };
    case 'broker':
      return {
        ...state,
        broker: action.value
      };
    case 'mc_num':
      return {
        ...state,
        mc_num: action.value
      };
    case 'dot_num':
      return {
        ...state,
        dot_num: action.value
      };
    case 'singleOp':
      return {
        ...state,
        singleOp: action.value
      };
    default:
      return state;
  }
}

