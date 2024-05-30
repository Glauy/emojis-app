import "server-only";
import Replicate from "replicate";
import { EMOJI_SIZE, SITE_URL } from "../lib/constants";

export class ReplicateClient {
  replicate: Replicate;

  constructor({ auth }: { auth: string }) {
    this.replicate = new Replicate({ auth });

    // 🫠 - https://github.com/replicate/replicate-javascript/issues/136
    this.replicate.fetch = (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, { ...init, cache: "no-store" });
  }

  async createEmoji({ id, prompt }: { id: string; prompt: string }) {
    const webhook = new URL(`${SITE_URL}/api/webhook/remove-background`);
    webhook.searchParams.set("id", id);
    webhook.searchParams.set("secret", process.env.API_SECRET as string);

    // prediction.id
    return this.replicate.predictions
      .create({
        version:
          "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
        input: {
          prompt: `A TOK emoji of a ${prompt}`,
          width: EMOJI_SIZE,
          height: EMOJI_SIZE,
          num_inference_steps: 30,
          // prompt_strength: 0.8,
          apply_watermark: false,
          negative_prompt:
            "racist, xenophobic, antisemitic, islamophobic, bigoted",
        },
        webhook: webhook.toString(),
        webhook_events_filter: ["completed"],
      })
      .then((prediction) => {
        console.log("Prediction ID:", prediction.id); // 打印 prediction id
        return prediction; // 将 prediction 对象传递给下一个 Promise 链
      });
  }

  async removeBackground({ id, image }: { id: string; image: string }) {
    const webhook = new URL(`${SITE_URL}/api/webhook/save-emoji`);
    webhook.searchParams.set("id", id);
    webhook.searchParams.set("secret", process.env.API_SECRET as string);

    return this.replicate.predictions.create({
      version:
        "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
      input: {
        image,
      },
      webhook: webhook.toString(),
      webhook_events_filter: ["completed"],
    });
  }

  async classifyPrompt({
    prompt: _prompt,
  }: {
    prompt: string;
  }): Promise<number> {
    const prompt = `[PROMPT] ${_prompt} [/PROMPT] [SAFETY_RANKING]`;

    const output = await this.replicate.run(
      "fofr/prompt-classifier:1ffac777bf2c1f5a4a5073faf389fefe59a8b9326b3ca329e9d576cce658a00f",
      {
        input: {
          prompt,
          max_new_tokens: 128,
          temperature: 0.2,
          top_p: 0.9,
          top_k: 50,
          stop_sequences: "[/SAFETY_RANKING]",
        },
      }
    );

    const safetyRating = Number(
      (output as string[] | undefined)?.join("").trim()
    );
    return safetyRating || 0;
  }

  async getPredictionStatus(predictionId: string) {
    const prediction = await this.replicate.predictions.get(predictionId);
    return prediction;
  }

  async waitForPrediction(predictionId: string) {
    while (true) {
      const prediction = await this.getPredictionStatus(predictionId);
      console.log(`Current status: ${prediction.status}`);

      if (prediction.status === "succeeded") {
        console.log("Prediction succeeded:", prediction.output);
        return prediction.output;
      }

      if (prediction.status === "failed") {
        console.error("Prediction failed:", prediction.error);
        throw new Error(prediction.error);
      }

      // 等待一段时间，然后再次查询
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

export const replicate = new ReplicateClient({
  auth: process.env.REPLICATE_API_TOKEN as string,
});
