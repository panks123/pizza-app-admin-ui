import { NavLink } from "react-router-dom";
import Icon from "@ant-design/icons";
import UserIcon from "../components/icons/UserIcon";
import { FoodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import DashboardIcon from "../components/icons/DashboardIcon";
import { UserRole } from "../config";

const items = [
    {
      key: "/",
      icon: <Icon component={DashboardIcon}/>,
      label: <NavLink to="/">Dashboard</NavLink>,
      allowedRoles: [UserRole.ADMIN, UserRole.MANAGER]
    },
    {
      key: "/users",
      icon: <Icon component={UserIcon}/>,
      label: <NavLink to="/users">Users</NavLink>,
      allowedRoles: [UserRole.ADMIN]
    },
    {
      key: "/restaurants",
      icon: <Icon component={FoodIcon}/>,
      label: <NavLink to="/restaurants">Restaurants</NavLink>,
      allowedRoles: [UserRole.ADMIN, UserRole.MANAGER]
    },
    {
      key: "/products",
      icon: <Icon component={BasketIcon}/>,
      label: <NavLink to="/products">Products</NavLink>,
      allowedRoles: [UserRole.ADMIN, UserRole.MANAGER]
    },
    {
      key: "/promos",
      icon: <Icon component={GiftIcon}/>,
      label: <NavLink to="/promos">Promos</NavLink>,
      allowedRoles: [UserRole.ADMIN, UserRole.MANAGER]
    },
  ]

export const getRoleBasedNavItems = (userRole: string) => {
  return items.filter((item) => item.allowedRoles.includes(userRole));
} 