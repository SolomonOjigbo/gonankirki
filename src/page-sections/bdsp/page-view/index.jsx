"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { TabContext, TabPanel } from "@mui/lab";
import { Layout } from "../layout";
import Overview from "../overview";
import Projects from "../projects";
import Activity from "../activity";
import Campaigns from "../inputrequests";
// import Documents from "../commodities";
import Buyers from "../buyers";
import useFetchUsers from "hooks/useFetchUsers";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import useFetchStats from "hooks/useFetchStats";
import Commodities from "../commodities";
import InputRequests from "../inputrequests";

const ProfilePageView = () => {
  const [tabValue, setTabValue] = useState("1");
  const { getBDSPUser, loading, error } = useFetchUsers();
  
  const params = useParams();
  const { id } = params;
  const [user, setUser] = useState(null);
 

  useEffect(() => {
    const fetchUser = async () => {
      // Try to fetch user using the hook
      const userData = getBDSPUser(id);
      if (userData) {
        setUser(userData);
      } else {
        // Fallback to Firestore if userData is undefined
        try {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, "users", id));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            console.error(`User with id ${id} does not exist in Firestore.`);
          }
        } catch (error) {
          console.error("Error fetching user from Firestore:", error);
        }
      }
    };

    fetchUser();
  }, [id, getBDSPUser]);


  const stats = useFetchStats(id);
 

  const handleTabChange = (_, value) => setTabValue(value);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <p>Error loading user: {error.message}</p>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <p>User not found.</p>
      </Box>
    );
  }

  return (
    <Box pt={2} pb={4}>
      <TabContext value={tabValue}>
        <Layout handleTabList={handleTabChange} user={user}>
          <TabPanel value="1">
            <Overview user={user} stats={stats}/>
          </TabPanel>

          <TabPanel value="2">
            <Projects user={user} stats={stats} />
          </TabPanel>

          <TabPanel value="3">
            <InputRequests user={user} stats={stats} />
          </TabPanel>

          <TabPanel value="4">
            <Commodities user={user} stats={stats}/>
          </TabPanel>

          <TabPanel value="5">
            <Buyers user={user} stats={stats}/>
          </TabPanel>

          <TabPanel value="6">
            <Activity user={user} stats={stats}/>
          </TabPanel>
        </Layout>
      </TabContext>
    </Box>
  );
};

export default ProfilePageView;
