import config from "../config";
import { Request, Response } from "express"
import webpush from "web-push";


webpush.setVapidDetails(
  "mailto:jacobole2000@gmail.com",
  config.vapid.public.valueOf(),
  config.vapid.private.valueOf()
);

// Subscribe Route
export const subscribe = async (req: Request, res: Response) => {
  // Get pushSubscription object
  const subscription = req.body;
  console.log(subscription)

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "Push Test" });

  // Pass object into sendNotification
  let x = await webpush.sendNotification(subscription, payload)
  console.log(x)
};