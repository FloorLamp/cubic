import { useGlobalContext } from "../../components/Store/Store";

/** Stub for address book */
export default function useNames() {
  const {
    state: { principal },
  } = useGlobalContext();
  const principals = {
    ...(principal
      ? {
          [principal.toText()]: "You",
        }
      : {}),
  };

  const principalName = (id: string): string | undefined => principals[id];
  return { principalName };
}
