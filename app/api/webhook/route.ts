// This file handles webhook events from Stripe. It verifies the signature
// of each request to ensure that the request is coming from Stripe. It also
// handles the checkout.session.completed event type by creating a new purchase record in the database.
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { createLogging, Logging } from "@/lib/logging";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    // Verifying the webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    // Log any error in webhook signature verification
    const logging: Logging = {
      url: req.url,
      method: req.method,
      body: body,
      statusCode: 400,
      errorMessage: error.message, // Using errorMessage instead of message
      createdAt: new Date(),
    };

    await createLogging(logging);

    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  // Log the session data for debugging
  console.log("Session Data:", session);
  
  if (event.type === "checkout.session.completed") {
    // Check if metadata is available
    if (!userId || !courseId) {
      const logging: Logging = {
        url: req.url,
        method: req.method,
        body: body,
        statusCode: 400,
        errorMessage: "Missing metadata", // Error message here
        createdAt: new Date(),
      };

      await createLogging(logging);

      return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
    }

    try {
      // Creating a purchase record in the database
      await db.purchase.create({
        data: {
          courseId: courseId,
          userId: userId,
        },
      });

      // Log successful creation of purchase record
      const logging: Logging = {
        url: req.url,
        method: req.method,
        body: body,
        statusCode: 200,
        errorMessage: "Purchase recorded successfully", // Log success message here
        createdAt: new Date(),
      };

      await createLogging(logging);

    } catch (dbError: any) {
      // Log database errors
      const logging: Logging = {
        url: req.url,
        method: req.method,
        body: body,
        statusCode: 500,
        errorMessage: dbError.message, // Log the error message here
        createdAt: new Date(),
      };

      await createLogging(logging);

      return new NextResponse(`Database Error: ${dbError.message}`, { status: 500 });
    }

    return new NextResponse("Webhook handled successfully", { status: 200 });
  } else {
    // If the event type is not handled
    const logging: Logging = {
      url: req.url,
      method: req.method,
      body: body,
      statusCode: 200,
      errorMessage: `Unhandled event type ${event.type}`, // Use errorMessage to log the unhandled event type
      createdAt: new Date(),
    };

    await createLogging(logging);

    return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 });
  }
}


// stripe listen --forward-to localhost:3000/api/webhook