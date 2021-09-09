import { padProjectId } from "../../lib/blocks";
import { useAsset } from "../../lib/hooks/useAsset";
import { assetUrl } from "../../lib/url";

export default function Asset({ id }: { id: string }) {
  const { data } = useAsset({ id });
  return <img src={assetUrl(`${padProjectId(id)}.svg`, data)} />;
}
