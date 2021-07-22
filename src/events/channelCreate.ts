import { App } from "@slack/bolt";

const channelCreateEvent = async (app: App): Promise<void> => {
  app.event("channel_created", async ({ event, client }) => {
    try {
      await client.conversations.join({ channel: event.channel.id });
    } catch (e) {
      console.error(e);
    }
  });
};

export default channelCreateEvent;
