import { MapContainer, TileLayer, Polygon, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Define custom icons for markers
const defaultMarkerIcon = new L.Icon({
  iconUrl: '/components/default-marker.png', // Replace with actual marker URL
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const redMarkerIcon = new L.Icon({
  iconUrl: '/components/red-icon-marker.png', // Replace with actual marker URL
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function FarmMap({ region, polygonCoordinates, markersToDelete = [], deleteMode = false }) {
  useEffect(() => {
    if (!region || !polygonCoordinates) {
      console.warn('Region or polygonCoordinates is missing. Map may not display correctly.');
    }
  }, [region, polygonCoordinates]);

  if (!region || !region.latitude || !region.longitude || polygonCoordinates.length === 0) return null;

  return (
    <MapContainer
      center={[region.latitude, region.longitude]}
      zoom={15}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Tile Layer */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Polygon to display the farmland */}
      {polygonCoordinates.length > 2 && (
        <Polygon
          positions={polygonCoordinates.map(({ latitude, longitude }) => [latitude, longitude])}
          pathOptions={{
            color: '#E40C0C', // Polygon border color
            fillColor: 'rgba(255, 255, 255, 0.6)', // Polygon fill color
            fillOpacity: 0.6,
          }}
        />
      )}

      {/* Markers for the perimeter */}
      {polygonCoordinates.map((coordinate, index) => (
        <Marker
          key={index}
          position={[coordinate.latitude, coordinate.longitude]}
          icon={deleteMode && markersToDelete.includes(coordinate) ? redMarkerIcon : defaultMarkerIcon}
        />
      ))}
    </MapContainer>
  );
}
