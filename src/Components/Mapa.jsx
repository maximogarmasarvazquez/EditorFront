// src/Components/Mapa.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Stage, Layer, Circle, Text, Label, Tag } from "react-konva";
import "leaflet/dist/leaflet.css";
import useDatos from "../service/useDatos.js";

const KonvaOverlay = ({ subestaciones }) => {
  const stageRef = useRef();
  const layerRef = useRef();
  const [points, setPoints] = useState([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hovered, setHovered] = useState(null);
  const [centerCoords, setCenterCoords] = useState(null);
  const map = useMap();

  // Convierte subestaciones en puntos del canvas
  const updatePoints = useCallback(() => {
    if (!map) return;
    const newPoints = subestaciones.map((s) => {
      const latLng = L.latLng(s.latitud, s.longitud);
      const pos = map.latLngToContainerPoint(latLng);
      return { ...s, x: pos.x, y: pos.y };
    });
    setPoints(newPoints);
  }, [map, subestaciones]);

  // Actualiza tamaño del Stage
  const updateSize = useCallback(() => {
    if (!map) return;
    const containerSize = map.getSize();
    setSize({ width: containerSize.x, height: containerSize.y });
  }, [map]);

  // Obtiene coordenadas del centro
  const updateCenter = useCallback(() => {
    if (!map) return;
    const center = map.getCenter();
    setCenterCoords(center);
  }, [map]);

  useEffect(() => {
    if (!map || !stageRef.current) return;
    const stage = stageRef.current;
    const layer = layerRef.current;

    // Zoom con rueda del ratón
    const handleWheel = (e) => {
      e.evt.preventDefault();
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      const scaleBy = 1.05;
      const direction = e.evt.deltaY > 0 ? 1 / scaleBy : scaleBy;
      const newScale = oldScale * direction;

      if (newScale < 0.5 || newScale > 3) return;

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      stage.scale({ x: newScale, y: newScale });
      stage.position({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });

      layer.batchDraw();
    };

    stage.on("wheel", handleWheel);

    // Redimensionamiento de ventana
    const handleResize = () => {
      updateSize();
      if (map) map.invalidateSize();
      layer.batchDraw();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      stage.off("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    };
  }, [map, updateSize]);

  useEffect(() => {
    if (!map) return;

    const handleAnim = () => {
      requestAnimationFrame(() => {
        updatePoints();
        updateCenter();
      });
    };

    map.on("zoomanim", handleAnim);
    map.on("move resize", handleAnim);

    updatePoints();
    updateSize();
    updateCenter();

    const observer = new ResizeObserver(updateSize);
    if (map.getContainer()) observer.observe(map.getContainer());

    return () => {
      map.off("zoomanim", handleAnim);
      map.off("move resize", handleAnim);
      if (map.getContainer()) observer.disconnect();
    };
  }, [map, updatePoints, updateSize, updateCenter]);

  if (!size.width || !size.height) return null;

  return (
    <Stage
      ref={stageRef}
      width={size.width}
      height={size.height}
      style={{ position: "absolute", top: 0, left: 0, zIndex: 1000 }}
    >
      <Layer ref={layerRef}>
        {points.map((p) => (
          <Circle
            key={p.id_subestacion}
            x={p.x}
            y={p.y}
            radius={8}
            fill="blue"
            onMouseEnter={() => setHovered(p)}
            onMouseLeave={() => setHovered(null)}
            listening={true}
          />
        ))}

        {hovered && (
          <Label x={hovered.x + 10} y={hovered.y - 10}>
            <Tag fill="black" opacity={0.75} cornerRadius={4} />
            <Text
              text={`Código: ${hovered.codigo}\nPotencia: ${hovered.potencia} kVA\nUbicación: ${hovered.ubicacion}\nZona: ${hovered.urbano_rural}`}
              fontSize={14}
              fill="white"
              padding={6}
            />
          </Label>
        )}

        {centerCoords && (
          <Text
            x={10}
            y={10}
            text={`Lat: ${centerCoords.lat.toFixed(5)}, Lng: ${centerCoords.lng.toFixed(5)}`}
            fontSize={14}
            fill="black"
          />
        )}
      </Layer>
    </Stage>
  );
};

const Mapa = () => {
  const { subestaciones } = useDatos();
  const [center, setCenter] = useState([0, 0]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (subestaciones && subestaciones.length > 0) {
      setCenter([subestaciones[0].latitud, subestaciones[0].longitud]);
      setLoaded(true);
    }
  }, [subestaciones]);

  if (!loaded) return <div>Cargando mapa...</div>;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <KonvaOverlay subestaciones={subestaciones} />
      </MapContainer>
    </div>
  );
};

export default Mapa;
