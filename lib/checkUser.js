import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { sendEmail } from "@/actions/send-email";
import { sendSMS } from "@/lib/twilio";
import { formatSMS } from "@/lib/sms-templates";
import EmailTemplate from "@/emails/template";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    try {
      await sendEmail({
        to: newUser.email,
        subject: "Welcome to Gullak",
        react: EmailTemplate({
          userName: newUser.name,
          type: "welcome",
        }),
      });
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }

    // Send welcome SMS if phone number is available
    if (newUser.phoneNumber) {
      try {
        await sendSMS({
          to: newUser.phoneNumber,
          body: formatSMS("welcome", { userName: newUser.name }),
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
