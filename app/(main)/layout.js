import React from "react";
import { checkUser } from "@/lib/checkUser";
import PhonePromptBanner from "@/components/phone-prompt-banner";
import { DesktopSidebar } from "@/components/app-sidebar";

const MainLayout = async ({ children }) => {
  const user = await checkUser();
  const hasPhone = !!user?.phoneNumber;

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <div className="flex-1 md:ml-64">
        <div className="pt-20 px-4 pb-8">
          <PhonePromptBanner hasPhone={hasPhone} />
          {children}
        </div>
      </div>
    </div>);

};

export default MainLayout;
