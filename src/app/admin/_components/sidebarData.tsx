import {
  LayoutDashboard,
  PackageSearch,
  Settings,
  Shirt,
  TargetIcon,
  ToolCaseIcon,
  User,
} from "lucide-react";

export type UserPermissions = {
  brands: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  categories: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  sellers: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  products: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canApprove: boolean;
  };
  users: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canBan: boolean;
  };
  orders: {
    canView: boolean;
    canEdit: boolean;
    canCancel: boolean;
    canRefund: boolean;
  };
  admins: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canManagePermissions: boolean;
  };
  reports: { canView: boolean; canExport: boolean };
};

export type ISidebarMenuItem = {
  title: string;
  link?: string;
  icon?: React.ReactNode;
  subMenu?: ISidebarMenuItem[];
  onlySuperAdmin?: boolean;
  permission?: {
    module: keyof UserPermissions;
    action: string;
  };
};

export const sidebarMenu: ISidebarMenuItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard />,
    link: "/admin/dashboard",
    // Dashboard is always visible - no permission check
  },
  {
    title: "Users",
    icon: <User />,
    link: "/admin/users",
    permission: { module: "users", action: "canView" },
  },
  {
    title: "Categories",
    icon: <ToolCaseIcon />,
    link: "/admin/categories",
    permission: { module: "categories", action: "canView" },
  },
  {
    title: "Brands",
    icon: <TargetIcon />,
    link: "/admin/brands",
    permission: { module: "brands", action: "canView" },
  },
  {
    title: "Sellers",
    icon: <User />,
    link: "/admin/sellers",
    permission: { module: "sellers", action: "canView" },
  },
  {
    title: "Products",
    icon: <Shirt />,
    link: "/admin/products",
    permission: { module: "products", action: "canView" },
  },
  {
    title: "Orders",
    icon: <PackageSearch />,
    link: "/admin/orders",
    permission: { module: "orders", action: "canView" },
  },
  {
    title: "Settings",
    icon: <Settings />,
    subMenu: [
      {
        title: "Admin",
        link: "/admin/settings/admin",
        permission: { module: "admins", action: "canView" },
      },
      {
        title: "General",
        link: "/admin/settings/general",
        // General settings always visible
      },
      {
        title: "Profile",
        link: "/admin/settings/profile",
        // Profile always visible
      },
      {
        title: "Security",
        link: "/admin/settings/security",
        // Security always visible
      },
    ],
  },
];

// Utility functions for permission filtering
export const filterMenuByPermissions = (
  menu: ISidebarMenuItem[],
  userPermissions: UserPermissions | undefined,
  isSuperAdmin: boolean = false,
): ISidebarMenuItem[] => {
  if (!userPermissions && !isSuperAdmin) return [menu[0]]; // Only show dashboard

  return menu
    .filter((item) => {
      // Check onlySuperAdmin flag first
      if (item.onlySuperAdmin && !isSuperAdmin) {
        return false;
      }

      // Check if user has permission for this item
      if (item.permission && userPermissions) {
        const { module, action } = item.permission;
        const modulePermissions = userPermissions[module];

        if (
          !modulePermissions ||
          !modulePermissions[action as keyof typeof modulePermissions]
        ) {
          return false; // User doesn't have permission
        }
      }

      return true; // No permission check required or user has permission
    })
    .map((item) => {
      // Filter submenu items
      if (item.subMenu && item.subMenu.length > 0) {
        const filteredSubMenu = item.subMenu.filter((subItem) => {
          // Check onlySuperAdmin flag for submenu items
          if (subItem.onlySuperAdmin && !isSuperAdmin) {
            return false;
          }

          // Check permission for submenu items
          if (subItem.permission && userPermissions) {
            const { module, action } = subItem.permission;
            const modulePermissions = userPermissions[module];

            return (
              modulePermissions &&
              modulePermissions[action as keyof typeof modulePermissions]
            );
          }

          return true; // No permission check required
        });

        return {
          ...item,
          subMenu: filteredSubMenu,
        };
      }

      return item;
    });
};

export const hasPermission = (
  userPermissions: UserPermissions | undefined,
  module: keyof UserPermissions,
  action: string,
): boolean => {
  if (!userPermissions) return false;

  const modulePermissions = userPermissions[module];
  return (
    modulePermissions &&
    modulePermissions[action as keyof typeof modulePermissions] === true
  );
};
