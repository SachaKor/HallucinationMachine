// eslint-disable-next-line import/prefer-default-export
export const addLayer = layer => ({
  type: 'ADD_LAYER',
  name: layer.name,
  fromChannel: layer.fromChannel,
  toChannel: layer.toChannel,
});

export const removeLayer = layerName => ({
  type: 'REMOVE_LAYER',
  layerName,
});


export const addLayerData = layerData => ({
  type: 'ADD_LAYER_DATA',
  layerData,
});

export const setLayerChecked = layerName => ({
  type: 'SET_LAYER_CHECKED',
  layerName,
});

export const updateLayer = layer => ({
  type: 'UPDATE_LAYER',
  layer,
});
