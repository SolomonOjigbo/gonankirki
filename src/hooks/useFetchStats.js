import { useEffect, useState, useCallback } from "react";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import useAuth from "./useAuth";

const useFetchStats = (id) => {
  const { db } = useAuth();
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
      const farmersSnapshot = await getDocs(query(collection(db, `users/${id}/farmers`)));
      const registeredFarmers = farmersSnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: id,
        ...doc.data(),
      }));

      const buyersSnapshot = await getDocs(query(collection(db, `users/${id}/buyers`)));
      const registeredBuyers = buyersSnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: id,
        ...doc.data(),
      }));

      const cropAvailabilityData = [];
      const inputRequestData = [];

      await Promise.all(
        registeredFarmers.map(async (farmer) => {
          const cropDocRef = doc(db, `users/${id}/farmers/${farmer.id}/CropAvailability`, "allCropData");
          const cropDocSnap = await getDoc(cropDocRef);

          if (cropDocSnap.exists()) {
            const cropDataList = cropDocSnap.data().cropDataList || [];
            cropDataList.forEach((crop) => {
              cropAvailabilityData.push({
                ...crop,
                farmerId: farmer.id,
                userId: id,
              });
            });
          }

          const inputDocRef = doc(db, `users/${id}/farmers/${farmer.id}/InputRequests`, "allInputRequests");
          const inputDocSnap = await getDoc(inputDocRef);

          if (inputDocSnap.exists()) {
            const inputRequestList = inputDocSnap.data().inputRequestList || [];
            inputRequestList.forEach((request) => {
              inputRequestData.push({
                ...request,
                farmerId: farmer.id,
                userId: id,
              });
            });
          }
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


  const getFarmerCropAvailability = useCallback(
    async (id, farmerId) => {
      if (!id || !farmerId) {
        throw new Error("User ID and Farmer ID are required to fetch crop availability");
      }
      try {
        const cropDocRef = doc(db, `users/${id}/farmers/${farmerId}/CropAvailability`, "allCropData");
        const cropDocSnap = await getDoc(cropDocRef);
  
        if (cropDocSnap.exists()) {
          return cropDocSnap.data().cropDataList || [];
        }
        return [];
      } catch (error) {
        console.error("Error fetching farmer crop availability:", error);
        throw error;
      }
    },
    [db, id]
  );
  
  const getFarmerInputRequests = useCallback(
    async (id, farmerId) => {
      if (!id || !farmerId) {
        throw new Error("User ID and Farmer ID are required to fetch input requests");
      }
      try {
        const inputDocRef = doc(db, `users/${id}/farmers/${farmerId}/InputRequests`, "allInputRequests");
        const inputDocSnap = await getDoc(inputDocRef);
  
        if (inputDocSnap.exists()) {
          return inputDocSnap.data().inputRequestList || [];
        }
        return [];
      } catch (error) {
        console.error("Error fetching farmer input requests:", error);
        throw error;
      }
    },
    [db, id]
  );

  return {
    ...stats,
    getFarmerCropAvailability,
    getFarmerInputRequests,
  };
};

export default useFetchStats;



