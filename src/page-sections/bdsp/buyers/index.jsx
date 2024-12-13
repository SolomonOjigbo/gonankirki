import { Grid, Box, Select, MenuItem } from "@mui/material"; // CUSTOM COMPONENTS

import ConnectionCard from "./ConnectionCard";
import { H6, Span } from "components/typography";
import FlexBetween from "components/flexbox/FlexBetween"; // CUSTOM DUMMY DATA
import BuyersListView from "./tables/BuyersListView"

// const CONNECTION_LIST = [{
//   id: 1,
//   connected: false,
//   name: "Miphoshka",
//   position: "Visual Designer",
//   img: "/static/user/user-11.png"
// }, {
//   id: 2,
//   connected: true,
//   name: "Tim Carrey",
//   position: "Visual Designer",
//   img: "/static/user/user-10.png"
// }, {
//   id: 3,
//   connected: false,
//   name: "Edward Norton",
//   position: "Visual Designer",
//   img: "/static/user/user-9.png"
// }, {
//   id: 4,
//   connected: true,
//   name: "Eva Mendes",
//   position: "Visual Designer",
//   img: "/static/user/user-8.png"
// }, {
//   id: 5,
//   connected: false,
//   name: "Vida Lao",
//   position: "Visual Designer",
//   img: "/static/user/user-7.png"
// }, {
//   id: 6,
//   connected: false,
//   name: "Angelina",
//   position: "Visual Designer",
//   img: "/static/user/user-6.png"
// }];

const Buyers = ({user, stats}) => {
  return (
  <Box py={3}>
     <BuyersListView user={user} stats={stats} />
    </Box>
    );
};

export default Buyers;