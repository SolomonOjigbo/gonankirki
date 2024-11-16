import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Retrieves the farmSize and savedMaps from AsyncStorage.
 * 
 * @returns {Promise<{ farmSize: string | null, savedMaps: Array | null }>} 
 *  A Promise that resolves with an object containing farmSize and savedMaps.
 *  If no data is found, it returns null for each key.
 */
export const getFarmData = async() => {
  try {
    // Get farmSize from AsyncStorage
    const farmSize = await AsyncStorage.getItem('farmSize');
    
    // Get savedMaps from AsyncStorage
    const savedMaps = await AsyncStorage.getItem('savedMaps');
    
    return {
      farmSize: farmSize ? JSON.parse(farmSize) : null,
      savedMaps: savedMaps ? JSON.parse(savedMaps) : null,
    };
  } catch (error) {
    console.error('Error retrieving farm data from AsyncStorage:', error);
    return {
      farmSize: null,
      savedMaps: null,
    };
  }
};
