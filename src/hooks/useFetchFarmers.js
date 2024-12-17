import { useContext, useEffect, useState, useMemo } from 'react';
import { query, collection, getDocs } from 'firebase/firestore';
import { AuthContext } from 'contexts/firebaseContext';

const useFetchFarmers = () => {
  const [registeredFarmers, setRegisteredFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { db } = useContext(AuthContext);
  const [cropAvailabilityData, setCropAvailabilityData] = useState([]);
  const [inputRequestData, setInputRequestData] = useState([]);

  useEffect(() => {
    const fetchFarmers = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(query(collection(db, 'users')));
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const farmersDataPromises = usersList.map(async user => {
          const farmersSnapshot = await getDocs(query(collection(db, `users/${user.id}/farmers`)));
          const farmersList = farmersSnapshot.docs.map(doc => ({ id: doc.id, userId: user.id, ...doc.data() }));

          const cropAvailabilityPromises = farmersList.map(farmer =>
            getDocs(query(collection(db, `users/${user.id}/farmers/${farmer.id}/CropAvailability`)))
              .then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, farmerId: farmer.id, userId: user.id, ...doc.data() })))
          );

          const inputRequestsPromises = farmersList.map(farmer =>
            getDocs(query(collection(db, `users/${user.id}/farmers/${farmer.id}/InputRequests`)))
              .then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, farmerId: farmer.id, userId: user.id, ...doc.data() })))
          );

          const [cropAvailabilityInfo, inputRequestInfo] = await Promise.all([
            Promise.all(cropAvailabilityPromises).then(res => res.flat()),
            Promise.all(inputRequestsPromises).then(res => res.flat())
          ]);

          setCropAvailabilityData(prevData => [...prevData, ...cropAvailabilityInfo]);
          setInputRequestData(prevData => [...prevData, ...inputRequestInfo]);

          return farmersList.map(farmer => ({
            ...farmer,
            cropAvailabilityInfo: cropAvailabilityInfo.filter(info => info.farmerId === farmer.id),
            inputRequestInfo: inputRequestInfo.filter(info => info.farmerId === farmer.id)
          }));
        });

        const farmersData = (await Promise.all(farmersDataPromises)).flat();
        setRegisteredFarmers(farmersData);
      } catch (error) {
        console.error('Error fetching farmers and crop availability:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, [db]);

  // Memoized function to find a farmer by ID
  const findFarmerById = useMemo(() => (id) => {
    return registeredFarmers.find(farmer => farmer.id === id);
  }, [registeredFarmers]);

  // Memoized function to find crop availability data by ID
  const findCropAvailabilityById = useMemo(() => (id) => {
    return cropAvailabilityData.find(crop => crop.id === id);
  }, [cropAvailabilityData]);

  // Memoized function to find input request by ID
  const findInputRequestById = useMemo(() => (id) => {
    return inputRequestData.find(request => request.id === id);
  }, [inputRequestData]);

  // Retrieve all farmer IDs
  const getAllFarmerIds = () => {
    return registeredFarmers.map((farmer) => ({
      params: { id: farmer.id },
    }));
  };

  // Retrieve all input request IDs
  const getAllInputRequestIds = () => {
    return inputRequestData.map((request) => ({
      params: { id: request.id },
    }));
  };

  // Retrieve all commodity IDs
  const getAllCommodityIds = () => {
    return cropAvailabilityData.map((crop) => ({
      params: { id: crop.id },
    }));
  };
  

  return {
    registeredFarmers,
    loading,
    findFarmerById,
    findCropAvailabilityById,
    findInputRequestById,
    error,
    cropAvailabilityData,
    inputRequestData,
    getAllFarmerIds,
    getAllCommodityIds,
    getAllInputRequestIds
  };
};

export default useFetchFarmers;
