// Example usage of the permission system in your sidebar component
import { filterMenuByPermissions, sidebarMenu } from "@/app/admin/_components/sidebarData";
import { usePermissions } from "@/hooks/usePermissions";
import React from "react";

const ExampleSidebarUsage = () => {
  const { permissions, isSuperAdmin, isAuthenticated } = usePermissions();

  // Filter menu items based on permissions
  const filteredMenu = React.useMemo(() => {
    return filterMenuByPermissions(sidebarMenu, permissions, isSuperAdmin);
  }, [permissions, isSuperAdmin]);

  if (!isAuthenticated) {
    return null; // or redirect to login
  }

  return (
    <div className="sidebar">
      <nav>
        {filteredMenu.map((item, index) => (
          <div key={index}>
            {/* Render main menu item */}
            {item.link ? (
              <a href={item.link} className="menu-item">
                {item.icon}
                {item.title}
              </a>
            ) : (
              <div className="menu-item">
                {item.icon}
                {item.title}
              </div>
            )}
            
            {/* Render submenu items if they exist */}
            {item.subMenu && item.subMenu.length > 0 && (
              <div className="submenu">
                {item.subMenu.map((subItem, subIndex) => (
                  <a key={subIndex} href={subItem.link} className="submenu-item">
                    {subItem.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

// Example usage in a page component
const ExamplePageUsage = () => {
  const { 
    canViewUsers, 
    canCreateUsers, 
    canViewAdmins, 
    canManageAdminPermissions,
    checkPermission 
  } = usePermissions();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      {/* Show different content based on permissions */}
      {canViewUsers && (
        <div>
          <h2>User Management</h2>
          {canCreateUsers && (
            <button>Create New User</button>
          )}
        </div>
      )}
      
      {canViewAdmins && (
        <div>
          <h2>Admin Management</h2>
          {canManageAdminPermissions && (
            <button>Manage Permissions</button>
          )}
        </div>
      )}
      
      {/* Custom permission check */}
      {checkPermission("products", "canCreate") && (
        <button>Create Product</button>
      )}
      
      {/* Show message if user has no permissions */}
      {!canViewUsers && !canViewAdmins && (
        <div>You don&apos;t have permission to access any admin features.</div>
      )}
    </div>
  );
};

export { ExamplePageUsage, ExampleSidebarUsage };
