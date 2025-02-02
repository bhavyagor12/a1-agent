import Quiz from "@/components/Quiz";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { NextPage } from "next";

type PageProps = {
  params: Promise<{ questionId?: string }>;
};

const QuestionPage: NextPage<PageProps> = async (props: PageProps) => {
  const { questionId } = await props.params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["question", questionId],
    queryFn: async () => {
      if (!questionId) return;
      const response = await fetch(`/api/quiz?questionId=${questionId}`);
      return response.json();
    },
  });

  if (!questionId) {
    return null;
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Quiz questionId={questionId} />
    </HydrationBoundary>
  );
};

export default QuestionPage;
