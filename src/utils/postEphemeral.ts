import { SlashCommand } from "@slack/bolt";

const postEphemeral = async (
  message: string,
  client: any,
  body: SlashCommand
): Promise<void> => {
  try {
    await client.chat.postEphemeral({
      channel: body.channel_id,
      user: body.user_id,
      text: message,
    });
  } catch (e) {
    console.error(e);
  }
};

export default postEphemeral;
