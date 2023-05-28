import config from "../config";
import { Request, Response } from "express";
import webpush from "web-push";
import Subscription from "./db/models/subscription.helper";

webpush.setVapidDetails("mailto:jacobole2000@gmail.com", config.vapid.public.valueOf(), config.vapid.private.valueOf());

// Subscribe Route
export const subscribe = async (req: Request, res: Response) => {
    // Get pushSubscription object
    console.log("Executed")
    const raw_subscription = req.body;
    try {
        const subscription: any = new Subscription(raw_subscription);
        let a = await Subscription.find({
            endpoint: subscription.endpoint,
        });
        console.log(a, subscription)
        if (a.length < 1) subscription.save();
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
    res.status(201).json();
};

export const sendNotifications = async () => {
    try {
        const subscriptions = await Subscription.find({});
        const payload = JSON.stringify({ title: "Administratorze!" });
        subscriptions.forEach(async (subscription: any) => {
            try {
                webpush.sendNotification(subscription, payload);
            } catch (error) {
                console.log(`Sending notification failed: ${error}.`);
            }
        });
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
};
