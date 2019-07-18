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
