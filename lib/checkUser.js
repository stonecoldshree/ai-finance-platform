import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { sendEmail } from "@/actions/send-email";
import { sendSMS } from "@/lib/twilio";
import { formatSMS } from "@/lib/sms-templates";
import EmailTemplate from "@/emails/template";
import { getTranslator } from "@/lib/i18n/translations";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id
      }
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      throw new Error("Clerk user has no email address");
    }

    const existingUserByEmail = await db.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      const updatedUser = await db.user.update({
        where: { id: existingUserByEmail.id },
        data: { clerkUserId: user.id, name, imageUrl: user.imageUrl }
      });
      return updatedUser;
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email
      }
    });

    const t = getTranslator(newUser.locale || "en");

    try {
      await sendEmail({
        to: newUser.email,
        subject: t("notifications.welcomeSub", {}, "Welcome to Gullak"),
        templateParams: {
          name: newUser.name,
          userName: newUser.name,
          alert_title: t("notifications.welcomeSub", {}, "Welcome to Gullak"),
          alert_message: t("notifications.welcomeAlertMessage", {}, "Your account is ready. Start tracking expenses, setting budgets, and receiving smart insights."),
          description: t("notifications.welcomeAlertDescription", {}, "Complete onboarding to unlock the full Gullak experience.")
        },
        react: EmailTemplate({
          userName: newUser.name,
          type: "welcome",
          locale: newUser.locale
        })
      });
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }


    if (newUser.phoneNumber) {
      try {
        await sendSMS({
          to: newUser.phoneNumber,
          body: formatSMS("welcome", { userName: newUser.name }, newUser.locale)
        });
      } catch (smsError) {
        console.error("Error sending welcome SMS:", smsError);
      }
    }

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
