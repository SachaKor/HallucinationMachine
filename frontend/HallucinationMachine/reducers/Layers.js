const initialState = [
  {
    name: 0,
    fromChannel: 0,
    toChannel: 0,
  }];


const Layers = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_LAYER':
      // console.log('REDUX: adding layer [' + action.name + '] from ' + action.fromChannel + ' to ' + action.toChannel)
      return [
        ...state,
        {
          name: action.name,
          fromChannel: action.fromChannel,
          toChannel: action.toChannel,
        },
      ];
    case 'REMOVE_LAYER':
      // console.log('REDUX: removing layer ' + action.layerName)
      return state.filter(layer => layer.name !== action.layerName);
    default:
      return state;
  }
};

export default Layers;
