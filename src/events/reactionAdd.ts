import { App } from "@slack/bolt";
import { StarboardDatabase } from "../index";

const reactionAddEvent = async (app: App): Promise<void> => {
  app.event("reaction_added", async ({ event, client }) => {
    try {
      if (event.reaction !== "star") return;
      const exists = await StarboardDatabase.read({
        filterByFormula: `{Message ID}="${event.item["ts"]}"`,
        maxRecords: 1,
      });
      if (exists.length > 0) {
        const updated = await StarboardDatabase.updateWhere(
          `{Message ID}="${event.item["ts"]}"`,
          {
            Stars: (exists[0]["fields"]["Stars"] as number) + 1,
          }
        );

        if ((updated[0].fields["Stars"] as number) < 3) return;
        const { permalink } = await client.chat.getPermalink({
          channel: event.item["channel"],
          message_ts: event.item["ts"],
        });

        const message = `⭐ *${updated[0].fields["Stars"]}*\n${permalink}`;

        const posted = await client.chat.postMessage({
          channel: "C028VGT0JMQ",
          text: message,
        });

        await StarboardDatabase.updateWhere(
          `{Message ID}="${event.item["ts"]}"`,
          {
            "Posted Message ID": posted.message.ts,
          }
        );
      } else {
        await StarboardDatabase.create({
          "Message ID": event.item["ts"],
          "Channel ID": event.item["channel"],
          Stars: 1,
        });
      }
    } catch {
      console.error;
    }
  });
};

export default reactionAddEvent;
