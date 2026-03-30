import React from "react";
import { getCachedUser } from "@/lib/cachedUser";
import PhonePromptBanner from "@/components/phone-prompt-banner";
import { DesktopSidebar } from "@/components/app-sidebar";

const MainLayout = async ({ children }) => {
  const user = await getCachedUser();
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
