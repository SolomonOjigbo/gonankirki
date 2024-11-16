


export const getAreaCorners = (lat, lon, radius) => {
    const earthRadius = 6378137; // Radius of Earth in meters

    // Calculate offsets in degrees
    const latOffset = radius / earthRadius * (180 / Math.PI);
    const lonOffset = radius / (earthRadius * Math.cos(Math.PI * lat / 180)) * (180 / Math.PI);

    // North-East Corner
    const neLat = lat + latOffset;
    const neLon = lon + lonOffset;

    // North-West Corner
    const nwLat = lat + latOffset;
    const nwLon = lon - lonOffset;

    // South-East Corner
    const seLat = lat - latOffset;
    const seLon = lon + lonOffset;

    // South-West Corner
    const swLat = lat - latOffset;
    const swLon = lon - lonOffset;

    return {
      northEast:  `latitude: ${neLat}, longitude: ${neLon}` ,
      northWest:  `latitude: ${nwLat}, longitude: ${nwLon}` ,
      southEast:  `latitude: ${seLat}, longitude: ${seLon}` ,
      southWest:  `latitude: ${swLat}, longitude: ${swLon}` ,
    };
  };
