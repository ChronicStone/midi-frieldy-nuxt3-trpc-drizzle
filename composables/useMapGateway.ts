const [useProvideMapGateway, _useMapGateway] = createInjectionState(() => {});

function useMapGateway() {
  const gateway = _useMapGateway();
  if (!gateway) throw new Error('No MapGateway provider present on parent scope');

  return gateway;
}

export { useProvideMapGateway, useMapGateway };
