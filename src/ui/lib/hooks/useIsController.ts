import { useGlobalContext } from "../../components/Store/Store";
import { principalIsEqual } from "../utils";
import { useInfo } from "./useInfo";

export function useIsController() {
  const {
    state: { principal },
  } = useGlobalContext();
  const info = useInfo();

  return !!info.data?.controllers.find((controller) =>
    principalIsEqual(controller, principal)
  );
}
