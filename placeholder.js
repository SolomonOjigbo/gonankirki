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
}, {
  name: "Reports & Analytics",
  path: "/dashboard/analytics-2",
  icon: duotone.BadgeDollar
},  {
  type: "label",
  label: "Management"
}, {
  name: "Your Profile",
  icon: duotone.UserProfile,
  path: "/dashboard/profile"
}, {
  name: "Accounts",
  icon: duotone.Accounts,
  path: "/dashboard/account"
}, 
{
  name: "Farmers Data",
  icon: duotone.UserList,
  children: [{
    name: "Add Farmer",
    path: "/dashboard/users/add-user"
  }, {
    name: "Registered Farmers",
    path: "/dashboard/users/user-list-1"
  }, ]
}, {
  name: "Crop Availablity Data",
  icon: duotone.AdminEcommerce,
  children: [{
    name: "All Submissions",
    path: "/dashboard/products/product-list-view"
  }, {
    name: "Submit Crop Availability",
    path: "/dashboard/products/create-product"
  }]
},  
{
  type: "label",
  label: "Admin"
},
{
  name: "BDSPs Data",
  icon: duotone.DataTable,
  children: [{
    name: "All BDSPs",
    path: "/dashboard/data-tables/table-1"
  }]
}, 
{
  name: "Sessions",
  icon: duotone.Session,
  children: [{
    name: "Login",
    path: "/login"
  }, {
    name: "Register User",
    path: "/register"
  }, {
    name: "Forget Password",
    path: "/forget-password"
  }]
},
 {
  name: "Pages",
  icon: duotone.Pages,
  children: [{
    name: "About",
    path: "/dashboard/about"
  }, {
    name: "Support",
    path: "/dashboard/support"
  }, ]
}];