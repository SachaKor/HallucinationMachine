const initialState = {
  layerData: [],
};

const Layers = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_LAYER':
      return [
        ...state.layerData,
        {
          name: action.name,
          fromChannel: action.fromChannel,
          toChannel: action.toChannel,
        },
      ];
    case 'REMOVE_LAYER':
      return state.layerData.filter(layer => layer.name !== action.layerName);
    case 'ADD_LAYER_DATA':
      return {
        layerData: action.layerData,
      };
    case 'SET_LAYER_CHECKED': // check the selected layer and uncheck all other ones
      return {
        layerData: state.layerData.map((layer) => {
          const temp = { ...layer };
          if (layer.name === action.layerName) {
            temp.selected = true;
            return temp;
          }
          temp.selected = false;
          return temp;
        }),
      };
    case 'UPDATE_LAYER':
      return {
        layerData: state.layerData.map((layer) => {
          const temp = { ...layer };
          if (layer.name === action.layer.name) {
            temp.fromChannel = action.layer.fromChannel;
            temp.toChannel = action.layer.toChannel;
          }
          return temp;
        }),
      };
    default:
      return state;
  }
};

export default Layers;
