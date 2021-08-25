import { useQuery } from "react-query";
import { protobufRoot, registry } from "../canisters";
import { ONE_MINUTES_MS } from "../constants";

/** Returns TC per ICP */
export const useCyclesPerIcp = () => {
  return useQuery(
    "cyclesPerIcp",
    async () => {
      if (process.env.NEXT_PUBLIC_DFX_NETWORK === "local") {
        return 60;
      }

      let res;
      try {
        res = (await registry.get_value({
          key: Buffer.from("xdr_per_icp"),
        })) as { value: Buffer; version: Long };
      } catch (error) {
        console.warn("registry.get_value:", error.message);
        return null;
      }
      const data = protobufRoot
        .lookupType("IcpXdrConversionRateRecord")
        .decode(res.value) as unknown as {
        timestampSeconds: number;
        xdrPermyriadPerIcp: number;
      };
      return data.xdrPermyriadPerIcp / 10_000;
    },
    {
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
