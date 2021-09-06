import { useRouter } from "next/dist/client/router";

export default function useId(): string | undefined {
  const router = useRouter();
  const { id } = router.query as { id: string };
  return id;
}
