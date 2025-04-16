import React from "react";

export default function SourceList({
  dataSources,
  activeDataSources,
  disconnectingSource,
  subscribeToSource,
  unsubscribeFromSource,
  deleteSource,
}) {
  return (
    <div className="w-1/5 border-r border-gray-800 flex flex-col bg-gray-950">
      <div className="p-3 border-b border-gray-700 bg-gray-950">
        <h2 className="text-sm uppercase tracking-wider text-neutral-400 font-semibold">
          Data Sources
        </h2>
      </div>
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <div className="space-y-2 p-2">
          {dataSources.map((source) => {
            const isActive = Boolean(activeDataSources[source.id]);

            return (
              <div
                key={source.id}
                className={`p-3 border rounded-md transition-colors ${
                  isActive
                    ? "border-blue-800 bg-gray-900"
                    : "border-neutral-700 bg-gray-900"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-neutral-200">
                      {source.name}
                    </h3>
                    <p className="text-sm text-neutral-400 mt-1">
                      {source.url}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      ID: {source.id}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {isActive ? (
                      <button
                        onClick={() => unsubscribeFromSource(source.id)}
                        className={`flex items-center justify-center text-neutral-200 text-sm px-2 py-1 rounded transition-colors ${
                          disconnectingSource === source.id
                            ? "bg-neutral-700 opacity-50 cursor-not-allowed"
                            : "bg-neutral-600 hover:bg-neutral-700"
                        }`}
                        disabled={disconnectingSource === source.id}
                        title="Disconnect"
                      >
                        {disconnectingSource === source.id ? (
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => subscribeToSource(source.id)}
                        className={`flex items-center justify-center text-white text-sm px-2 py-1 rounded transition-colors ${
                          disconnectingSource === source.id
                            ? "bg-neutral-700 opacity-50 cursor-not-allowed"
                            : "bg-neutral-600 hover:bg-neutral-700"
                        }`}
                        disabled={disconnectingSource === source.id}
                        title="Connect"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => deleteSource(source.id)}
                      className={`flex items-center justify-center text-red-200 text-sm px-2 py-1 rounded transition-colors ${
                        disconnectingSource === source.id
                          ? "bg-red-800 opacity-50 cursor-not-allowed"
                          : "bg-red-900 hover:bg-red-800"
                      }`}
                      disabled={disconnectingSource === source.id}
                      title="Delete source"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {isActive && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">
                      <span className="w-2 h-2 mr-1 bg-blue-400 rounded-full"></span>
                      Active
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
