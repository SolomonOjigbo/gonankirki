// CUSTOM ICON COMPONENT
import duotone from "icons/duotone";
export const navigations = [
  
  {
  type: "label",
  label: "Dashboard"
}, {
  name: "Dashboard",
  path: "/dashboard",
  icon: duotone.PersonChalkboard
},

// {
//   name: "Reports & Analytics",
//   path: "/dashboard/analytics-2",
//   icon: duotone.BadgeDollar
// }, 

{
  type: "label",
  label: "Farmer Management"
}, 
{
  name: "Farmers Data",
  icon: duotone.UserList,
  children: [{
    name: "Add Farmer",
    path: "/dashboard/users/add-farmer"
  }, {
    name: "All Registered Farmers",
    path: "/dashboard/users/all-farmers"
  }, ]
}, {
  name: "Crop Availablity Data",
  icon: duotone.AdminEcommerce,
  children: [{
    name: "All Submissions",
    path: "/dashboard/products/crop-availability-data"
  }, {
    name: "Submit Crop Availability",
    path: "/dashboard/products/crop-availability-form"
  }]
}, {
  name: "Input Request Form",
  icon: duotone.DataTable,
  children: [{
    name: "All Input Requests",
    path: "/dashboard/products/input-requests"
  }, {
    name: "New Input Request",
    path: "/dashboard/products/input-request-form"
  }]
},  
{
  type: "label",
  label: "Admin"
}, {
  name: "Admin Profile",
  icon: duotone.Accounts,
  path: "/dashboard/account"
}, {
  name: "Reset Password",
  icon: duotone.Settings,
  path: "/forget-password"
},
{
  name: "BDSPs Database",
  icon: duotone.Session,
  children: [
    {
      name: "All BDSPs",
      path: "/dashboard/bdsp-users/all-bdsps"
    } , {
    name: "Register BDSP(User) Account",
    path: "#"
  }]
},
 {
  name: "Information",
  icon: duotone.Pages,
  children: [{
    name: "About",
    path: "#"
  }, {
    name: "Support",
    path: "#"
  }, ]
}];