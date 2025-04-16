import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  Map,
  Source,
  Layer,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { getSourceColor } from "../../../utils/MapUtils";

export default function MapComponent({
  viewState,
  setViewState,
  geojsonData,
  pointFeatures,
  layerStyles,
}) {
  const mapRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [drawnFeatures, setDrawnFeatures] = useState(null);

  const validatedGeoJson = useMemo(() => {
    if (!geojsonData) return null;

    try {
      const validatedData = {
        type: geojsonData.type || "FeatureCollection",
        features: [],
      };

      if (Array.isArray(geojsonData.features)) {
        validatedData.features = geojsonData.features.filter((feature) => {
          
          if (!feature || !feature.geometry) return false;

          if (feature.geometry.type === "Point") {
            return (
              Array.isArray(feature.geometry.coordinates) &&
              feature.geometry.coordinates.length >= 2 &&
              !isNaN(feature.geometry.coordinates[0]) &&
              !isNaN(feature.geometry.coordinates[1])
            );
          }

          if (feature.geometry.type === "LineString") {
            return (
              Array.isArray(feature.geometry.coordinates) &&
              feature.geometry.coordinates.length >= 2 &&
              feature.geometry.coordinates.every(
                (coord) =>
                  Array.isArray(coord) &&
                  coord.length >= 2 &&
                  !isNaN(coord[0]) &&
                  !isNaN(coord[1])
              )
            );
          }

          if (feature.geometry.type === "Polygon") {
            return (
              Array.isArray(feature.geometry.coordinates) &&
              feature.geometry.coordinates.length > 0 &&
              feature.geometry.coordinates.every(
                (ring) =>
                  Array.isArray(ring) &&
                  ring.length >= 4 &&
                  ring.every(
                    (coord) =>
                      Array.isArray(coord) &&
                      coord.length >= 2 &&
                      !isNaN(coord[0]) &&
                      !isNaN(coord[1])
                  )
              )
            );
          }

          return true;
        });
      }

      return validatedData;
    } catch (err) {
      console.error("Error validating GeoJSON:", err);
      return null;
    }
  }, [geojsonData]);

  const validPointFeatures = useMemo(() => {
    if (!pointFeatures || !Array.isArray(pointFeatures)) return [];

    return pointFeatures.filter(
      (feature) =>
        feature &&
        feature.geometry &&
        feature.geometry.type === "Point" &&
        Array.isArray(feature.geometry.coordinates) &&
        feature.geometry.coordinates.length >= 2 &&
        !isNaN(feature.geometry.coordinates[0]) &&
        !isNaN(feature.geometry.coordinates[1])
    );
  }, [pointFeatures]);

  useEffect(() => {
    return () => {
      const mapInstance = mapRef.current?.getMap?.();
      if (mapInstance) {
        try {
          const existingControls = mapInstance._controls || [];
          existingControls.forEach((control) => {
            if (control instanceof MapboxDraw) {
              mapInstance.removeControl(control);
            }
          });
        } catch (err) {
          console.warn("Error cleaning up map controls:", err);
        }
      }
    };
  }, []);

  useEffect(() => {
    const mapInstance = mapRef.current?.getMap?.();
    if (!mapInstance) return;

    let drawControl = null;

    const removeExistingDrawControl = () => {
      try {
        const existingControls = mapInstance._controls || [];
        existingControls.forEach((control) => {
          if (control instanceof MapboxDraw) {
            mapInstance.removeControl(control);
          }
        });
      } catch (err) {
        console.warn("Error removing existing draw control:", err);
      }
    };

    removeExistingDrawControl();

    if (isEditMode) {
      try {
        drawControl = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            point: true,
            line_string: true,
            polygon: true,
            trash: true,
          },
        });

        mapInstance.addControl(drawControl);

        const updateDrawnFeatures = () => {
          if (drawControl) {
            const features = drawControl.getAll();
            setDrawnFeatures(features);
          }
        };

        mapInstance.on("draw.create", updateDrawnFeatures);
        mapInstance.on("draw.update", updateDrawnFeatures);
        mapInstance.on("draw.delete", updateDrawnFeatures);

        if (
          drawnFeatures &&
          drawnFeatures.features &&
          drawnFeatures.features.length > 0
        ) {
          try {
            drawControl.add(drawnFeatures);
          } catch (err) {
            console.warn("Error adding saved features to draw control:", err);
          }
        }

        return () => {
          if (mapInstance) {
            mapInstance.off("draw.create", updateDrawnFeatures);
            mapInstance.off("draw.update", updateDrawnFeatures);
            mapInstance.off("draw.delete", updateDrawnFeatures);

            if (drawControl) {
              try {
                const features = drawControl.getAll();
                setDrawnFeatures(features);
              } catch (err) {
                console.warn("Error saving features:", err);
              }
              removeExistingDrawControl();
            }
          }
        };
      } catch (err) {
        console.error("Error setting up draw control:", err);
      }
    }
  }, [isEditMode]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const geojson = JSON.parse(event.target.result);
        setDrawnFeatures(geojson);

        const mapInstance = mapRef.current?.getMap?.();
        if (mapInstance && isEditMode) {
          const existingControls = mapInstance._controls || [];
          const drawControl = existingControls.find(
            (control) => control instanceof MapboxDraw
          );

          if (drawControl) {
            drawControl.deleteAll();
            drawControl.add(geojson);
          }
        }
      } catch (err) {
        alert("Invalid GeoJSON file!");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleDownload = () => {
    const mapInstance = mapRef.current?.getMap?.();
    if (!mapInstance) return;

    try {
      const existingControls = mapInstance._controls || [];
      const drawControl = existingControls.find(
        (control) => control instanceof MapboxDraw
      );

      if (drawControl) {
        const data = drawControl.getAll();
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "map-features.geojson";
        a.click();

        URL.revokeObjectURL(url);
      } else if (drawnFeatures) {
        const blob = new Blob([JSON.stringify(drawnFeatures)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "map-features.geojson";
        a.click();

        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Error downloading features:", err);
    }
  };

  const handleClear = () => {
    const mapInstance = mapRef.current?.getMap?.();
    if (!mapInstance) return;

    try {
      const existingControls = mapInstance._controls || [];
      const drawControl = existingControls.find(
        (control) => control instanceof MapboxDraw
      );

      if (drawControl) {
        drawControl.deleteAll();
        setDrawnFeatures(null);
      }
    } catch (err) {
      console.error("Error clearing features:", err);
    }
  };

  const renderSafeLayer = (layer) => {
    if (
      !validatedGeoJson ||
      !validatedGeoJson.features ||
      validatedGeoJson.features.length === 0
    ) {
      return null;
    }

    if (
      layer.id.includes("line") &&
      !validatedGeoJson.features.some(
        (f) =>
          f.geometry &&
          (f.geometry.type === "LineString" ||
            f.geometry.type === "MultiLineString")
      )
    ) {
      return null;
    }

    if (
      layer.id.includes("polygon") &&
      !validatedGeoJson.features.some(
        (f) =>
          f.geometry &&
          (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon")
      )
    ) {
      return null;
    }

    if (
      layer.id.includes("point") &&
      !validatedGeoJson.features.some(
        (f) => f.geometry && f.geometry.type === "Point"
      )
    ) {
      return null;
    }

    return <Layer {...layer} />;
  };

  return (
    <div className="w-3/5 relative">
      {/* Edit Mode UI Controls - Now centered at top */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-row items-center gap-2 bg-gray-900/80 px-3 py-1.5 rounded-md shadow-lg">
          <button
            onClick={toggleEditMode}
            className={`px-3 py-1 text-xs rounded cursor-pointer transition-colors ${
              isEditMode
                ? "bg-gray-600 text-gray-200"
                : "bg-gray-600 text-gray-200"
            }`}
          >
            {isEditMode ? "Exit Edit" : "Edit GeoJSON"}
          </button>

          {isEditMode && (
            <>
              <label className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs text-center cursor-pointer text-white">
                Upload
                <input
                  type="file"
                  accept=".geojson,application/geo+json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs cursor-pointer text-white"
              >
                Download
              </button>

              <button
                onClick={handleClear}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs cursor-pointer text-white"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      <Map
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1Ijoic2xheWVycGl5dXNoIiwiYSI6ImNtOWJuY2pmZzBsMGYybHM3bnJxY2lmcmMifQ.enmR_89C12BX9F2FWe3guA"
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <NavigationControl position="top-left" />

        {/* Display API GeoJSON data - always show non-point features */}
        {validatedGeoJson && (
          <Source
            id="geospatial-data"
            type="geojson"
            data={validatedGeoJson}
            options={{
              animate: true,
              animationDuration: 1000,
            }}
          >
            {renderSafeLayer(layerStyles.lines)}
            {renderSafeLayer(layerStyles.multiLines)}
            {renderSafeLayer(layerStyles.polygonFill)}
            {renderSafeLayer(layerStyles.polygonOutline)}
            {renderSafeLayer(layerStyles.multiPolygonFill)}
            {renderSafeLayer(layerStyles.multiPolygonOutline)}
            {/* Only show API points when not in edit mode, since they conflict with draw points */}
            {!isEditMode && renderSafeLayer(layerStyles.points)}
          </Source>
        )}

        {/* Custom markers for point features - always show, even in edit mode */}
        {validPointFeatures.map((feature, index) => (
          <Marker
            key={`marker-${index}`}
            longitude={feature.geometry.coordinates[0]}
            latitude={feature.geometry.coordinates[1]}
          >
            <div
              style={{
                width: "15px",
                height: "15px",
                background: getSourceColor(
                  feature.properties?._sourceId || "default",
                  "point"
                ),
                border: "2px solid #1f2937",
                borderRadius: "50%",
                cursor: "pointer",
                boxShadow: "0 0 0 2px rgba(255,255,255,0.15)",
              }}
              title={feature.properties?.name || "Point"}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
}
