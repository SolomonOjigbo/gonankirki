import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import useAuth from "./useAuth";


const useFetchStats = (id) => {
    const {db} = useAuth();
  const [stats, setStats] = useState({
    registeredFarmers: [],
    registeredBuyers: [],
    cropAvailabilityData: [],
    inputRequestData: [],
    loading: true,
    error: null,
  });

  const fetchDataFromFirestore = useCallback(async () => {
    if (!id) {
      setStats((prev) => ({
        ...prev,
        error: new Error("User ID is required to fetch stats"),
        loading: false,
      }));
      return;
    }

    try {
      // Fetch farmers
      const farmersSnapshot = await getDocs(query(collection(db, `users/${id}/farmers`)));
      const registeredFarmers = farmersSnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: id,
        ...doc.data(),
      }));

      // Fetch buyers
      const buyersSnapshot = await getDocs(query(collection(db, `users/${id}/buyers`)));
      const registeredBuyers = buyersSnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: id,
        ...doc.data(),
      }));

      // Fetch crop availability and input request data
      const cropAvailabilityData = [];
      const inputRequestData = [];

      await Promise.all(
        registeredFarmers.map(async (farmer) => {
          // Fetch CropAvailability
          const cropAvailabilitySnapshot = await getDocs(
            query(collection(db, `users/${id}/farmers/${farmer.id}/CropAvailability`))
          );
          cropAvailabilityData.push(
            ...cropAvailabilitySnapshot.docs.map((doc) => ({
              id: doc.id,
              farmerId: farmer.id,
              userId: id,
              ...doc.data(),
            }))
          );

          // Fetch InputRequests
          const inputRequestSnapshot = await getDocs(
            query(collection(db, `users/${id}/farmers/${farmer.id}/InputRequests`))
          );
          inputRequestData.push(
            ...inputRequestSnapshot.docs.map((doc) => ({
              id: doc.id,
              farmerId: farmer.id,
              userId: id,
              ...doc.data(),
            }))
          );
        })
      );

      setStats({
        registeredFarmers,
        registeredBuyers,
        cropAvailabilityData,
        inputRequestData,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats((prev) => ({
        ...prev,
        error,
        loading: false,
      }));
    }
  }, [id]);

  useEffect(() => {
    fetchDataFromFirestore();
  }, [fetchDataFromFirestore]);

//   const findFarmerById = (farmerId) => stats.registeredFarmers.find((farmer) => farmer.id === farmerId);

  return {
    ...stats
   
  };
};

export default useFetchStats;
