// src/Components/Mapa.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Stage, Layer, Circle, Text } from "react-konva";
import "leaflet/dist/leaflet.css";
import useDatos from "../service/useDatos.js";
import { Label, Tag } from "react-konva";

const KonvaOverlay = ({ subestaciones }) => {
  const stageRef = useRef();
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
    if (!map) return;

    const handleAnim = () => {
      requestAnimationFrame(() => {
        updatePoints();
        updateCenter();
      });
    };

    // Usamos zoomanim para animaciones fluidas
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
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      {/* Subestaciones */}
    <Layer>
      {points.map((p) => (
       <Circle
          key={p.id_subestacion}
          x={p.x}
          y={p.y}
          radius={8}
          fill="blue"
          onMouseEnter={() => setHovered(p)}
          onMouseLeave={() => setHovered(null)}
          listening={true} // 👈 asegura que capture eventos
        />
       ))}

      {/* Tooltip con datos */}
    {hovered && (
      <Label x={hovered.x + 10} y={hovered.y - 10}>
        <Tag
          fill="black"
          opacity={0.75}
          cornerRadius={4}
        />
        <Text
          text={
            `Código: ${hovered.codigo}\n` +
            `Potencia: ${hovered.potencia} kVA\n` +
            `Ubicación: ${hovered.ubicacion}\n` +
            `Zona: ${hovered.urbano_rural}`
          }
          fontSize={14}
          fill="white"
          padding={6}
        />
      </Label>
      )}
    </Layer>

      {/* Mostrar coords del centro */}
      {centerCoords && (
        <Layer>
          <Text
            x={10}
            y={10}
            text={`Lat: ${centerCoords.lat.toFixed(5)}, Lng: ${centerCoords.lng.toFixed(5)}`}
            fontSize={14}
            fill="black"
          />
        </Layer>
      )}
    </Stage>
  );
};

const Mapa = () => {
  const { subestaciones } = useDatos();

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <MapContainer
        center={[-31.918278, -64.5757]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
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
