import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameInitials } from "@/lib/utils";
import { switchSidebar } from "@/redux/admin/adminSettingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Menu } from "lucide-react";
import React from "react";

type Props = {};

const AdminHeader = (props: Props) => {
  const dispatch = useAppDispatch();
  const { user, sidebar } = useAppSelector((state) => ({
    user: state.auth.user,
    sidebar: state.adminSettings.sidebar,
  }));

  return (
    <div className={`h-[8vh] border-b flex items-center justify-between px-5`}>
      <button
        className=""
        onClick={() => dispatch(switchSidebar(!sidebar))}
      >
        <Menu size={28} />
      </button>

      <div className="flex items-center">
        <Avatar className="border border-slate-200 cursor-pointer size-10 -mt-1">
          <AvatarImage
            src={user?.profileImage?.url}
            alt={user?.profileImage?.alt}
          />
          <AvatarFallback className="bg-slate-500 text-white text-xs">
            {nameInitials(user?.name)}
          </AvatarFallback>
        </Avatar>

        <div className="ml-2">
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          <h3 className="text-sm font-semibold">{user?.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
