import { assetUrl } from "../../lib/url";

export default function Asset({ id }: { id: string }) {
  return (
    <>
      {id === "0" && <img src={assetUrl("000.svg")} />}
      {id === "1" && <img src={assetUrl("001.svg")} />}
      {id === "2" && <img src={assetUrl("002.svg")} />}
    </>
  );
}
