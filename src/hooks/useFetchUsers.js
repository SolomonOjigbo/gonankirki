import { useContext, useEffect, useState } from 'react';
import { query, collection, getDocs } from 'firebase/firestore';
import { AuthContext } from 'contexts/firebaseContext';

const useFetchUsers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { db } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [bdspUser, setBDSPUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const usersData = await Promise.all(
          usersList.map(async (user) => {
            const farmersCollection = collection(db, `users/${user.id}/farmers`);
            const farmersSnapshot = await getDocs(farmersCollection);

            let farmerCount = farmersSnapshot.size;
            let cropAvailabilityTotal = 0;
            let inputRequestsTotal = 0;

            for (const farmerDoc of farmersSnapshot.docs) {
              const farmerId = farmerDoc.id;

              const cropAvailabilityCollection = collection(
                db,
                `users/${user.id}/farmers/${farmerId}/CropAvailability`
              );
              const cropAvailabilitySnapshot = await getDocs(
                cropAvailabilityCollection
              );
              cropAvailabilityTotal += cropAvailabilitySnapshot.size;

              const inputRequestsCollection = collection(
                db,
                `users/${user.id}/farmers/${farmerId}/InputRequests`
              );
              const inputRequestsSnapshot = await getDocs(inputRequestsCollection);
              inputRequestsTotal += inputRequestsSnapshot.size;
            }

            return {
              ...user,
              farmerCount,
              cropAvailabilityNum: cropAvailabilityTotal,
              inputRequestsNum: inputRequestsTotal,
            };
          })
        );

        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db]);

  const getBDSPUser = (id) => {
    const BDSPUser = users.find((user) => user.id === id);
    if (!BDSPUser) {
      console.warn(`User with ID ${id} not found`);
    }
    return BDSPUser;
  };

  const aggregateRegisteredFarmers = async () => {
    try {
      const farmersPerUser = {};
      for (const user of users) {
        const farmerCollection = collection(db, `users/${user.id}/farmers`);
        const farmerSnapshot = await getDocs(farmerCollection);
        farmersPerUser[user.id] = farmerSnapshot.size;
      }
      return farmersPerUser;
    } catch (err) {
      console.error('Error aggregating farmers:', err);
      return null;
    }
  };

  const getTotalRegisteredFarmers = async () => {
    try {
      let totalFarmers = 0;
      for (const user of users) {
        const farmerCollection = collection(db, `users/${user.id}/farmers`);
        const farmerSnapshot = await getDocs(farmerCollection);
        totalFarmers += farmerSnapshot.size;
      }
      return totalFarmers;
    } catch (err) {
      console.error('Error getting total farmers:', err);
      return 0;
    }
  };

  const getTotalRegisteredUsers = () => {
    return users.length;
  };

  return {
    users,
    getBDSPUser,
    aggregateRegisteredFarmers,
    getTotalRegisteredFarmers,
    getTotalRegisteredUsers,
    loading,
    error,
  };
};

export default useFetchUsers;
