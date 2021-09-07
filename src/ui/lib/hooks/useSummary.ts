import { useAllSummary } from "./useAllSummary";

export const useSummary = ({ id }: { id: string }) => {
  const allStatus = useAllSummary();
  return allStatus.data?.find((item) => item.projectId === id);
};
