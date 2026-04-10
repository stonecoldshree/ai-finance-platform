import React from "react";
import { getCachedUser } from "@/lib/cachedUser";
import PhonePromptBanner from "@/components/phone-prompt-banner";
import { DesktopSidebar } from "@/components/app-sidebar";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { getUserAccounts } from "@/actions/dashboard";

const MainLayout = async ({ children }) => {
  const user = await getCachedUser();
  const hasPhone = !!user?.phoneNumber;

  let hasAccounts = false;
  try {
    const accounts = await getUserAccounts();
    hasAccounts = accounts && accounts.length > 0;
  } catch (error) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.message?.includes("Dynamic server usage")) {
      throw error;
    }
    // If fetch fails, assume no accounts
    hasAccounts = false;
  }

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <div className="flex-1 md:ml-64">
        <div className="pt-20 px-4 pb-8">
          <PhonePromptBanner hasPhone={hasPhone} />
          <OnboardingWizard hasAccounts={hasAccounts} />
          {children}
        </div>
      </div>
    </div>);

};

export default MainLayout;
