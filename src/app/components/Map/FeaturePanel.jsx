import React from "react";

export default function FeaturePanel({
  activeDataSources,
  dataSources,
  focusOnFeature,
}) {
  return (
    <div className="w-1/5 border-l border-gray-800 flex flex-col bg-gray-950">
      <div className="p-3 border-b border-gray-800 bg-gray-950">
        <h2 className="text-sm uppercase tracking-wider text-neutral-400 font-semibold">
          Features
        </h2>
      </div>
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <div className="p-2">
          {Object.keys(activeDataSources).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(activeDataSources).map(([sourceId, data]) => {
                const sourceName =
                  dataSources.find((s) => s.id === sourceId)?.name || sourceId;

                return (
                  <div
                    key={sourceId}
                    className="border rounded-md overflow-hidden bg-gray-950 shadow-sm border-gray-700"
                  >
                    <div className="bg-gray-700 p-2 border-b border-gray-600">
                      <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold text-neutral-300">
                          {sourceName}
                        </h2>
                        <span className="text-xs text-neutral-400">
                          {data &&
                          data.type === "FeatureCollection" &&
                          data.features
                            ? `${data.features.length} features`
                            : "1 feature"}
                        </span>
                      </div>
                    </div>

                    <div className="p-2">
                      {data &&
                      data.type === "FeatureCollection" &&
                      data.features ? (
                        <div className="space-y-2">
                          {data.features.map((feature, index) => (
                            <div
                              key={index}
                              className="bg-gray-900 p-2 rounded border border-gray-700"
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium text-sm text-neutral-200">
                                  {feature.properties?.name ||
                                    `Feature #${index + 1}`}
                                </h3>
                                <button
                                  onClick={() => focusOnFeature(feature)}
                                  className="bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs py-1 px-2 rounded transition-colors"
                                >
                                  Focus
                                </button>
                              </div>
                              <p className="text-xs text-neutral-400 mt-1">
                                Type: {feature.geometry?.type}
                              </p>
                              {feature.properties?.description && (
                                <p className="text-xs mt-1 text-neutral-300">
                                  {feature.properties.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-900 p-2 rounded border border-gray-800">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-sm text-neutral-200">
                              {data?.properties?.name || "Single Feature"}
                            </h3>
                            <button
                              onClick={() => focusOnFeature(data)}
                              className="bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs py-1 px-2 rounded transition-colors"
                            >
                              Focus
                            </button>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">
                            Type: {data?.geometry?.type || "Unknown"}
                          </p>
                          <div className="mt-2 text-xs font-mono bg-neutral-900 p-2 rounded border border-neutral-700 overflow-auto max-h-28 text-neutral-300">
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-400 bg-gray-900 p-3 rounded-md border border-neutral-600 text-xs">
              No active data sources. Connect to a data source to see features.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
