import { useMutation, useQueryClient } from "react-query";
import { useCubic } from "../../components/Store/Store";
import { ProjectDetails_v2 } from "../../declarations/Cubic/Cubic.did";

export default function useNewProject() {
  const queryClient = useQueryClient();
  const cubic = useCubic();

  return useMutation(
    "newProject",
    async (details: ProjectDetails_v2) => {
      return await cubic.newProject(details);
    },
    {
      onSuccess: async (data) => {
        queryClient.refetchQueries("info");
      },
    }
  );
}
