import { OpenGraphImage } from "@/components/opengraph-image";
import { FEATURED_OG_IMAGES } from "@/lib/constants";
import { getRandomItem } from "@/lib/utils";

export { contentType, size } from "@/components/favicon";

export default async function Image() {
  return OpenGraphImage({ url: getRandomItem(FEATURED_OG_IMAGES) });
}
