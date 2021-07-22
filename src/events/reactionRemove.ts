import { App } from "@slack/bolt";
import { StarboardDatabase } from "../index";

const reactionRemoveEvent = async (app: App): Promise<void> => {
  app.event("reaction_removed", async ({ event, client }) => {
    try {
      if (event.reaction !== "star") return;
      const exists = await StarboardDatabase.read({
        filterByFormula: `{Message ID}="${event.item["ts"]}"`,
        maxRecords: 1,
      });

      if (exists.length <= 0) return;

      const updated = await StarboardDatabase.updateWhere(
        `{Message ID}="${event.item["ts"]}"`,
        {
          Stars: (exists[0]["fields"]["Stars"] as number) - 1,
        }
      );

      if ((updated[0].fields["Stars"] as number) === 0) {
        if (!updated[0].fields["Posted Message ID"]) return;
        await client.chat.delete({
          channel: "C028VGT0JMQ",
          ts: updated[0].fields["Posted Message ID"] as string,
        });
      }

      const { permalink } = await client.chat.getPermalink({
        channel: event.item["channel"],
        message_ts: event.item["ts"],
      });

      const message = `⭐ *${updated[0].fields["Stars"]}*\n${permalink}`;

      await client.chat.update({
        channel: "C028VGT0JMQ",
        ts: updated[0].fields["Posted Message ID"] as string,
        text: message,
      });
    } catch {
      console.error;
    }
  });
};

export default reactionRemoveEvent;
