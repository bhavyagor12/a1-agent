import { PageProps } from "@/.next/types/app/layout";
import Quiz from "@/components/Quiz";
import { NextPage } from "next";

type PageProps = {
  params: Promise<{ questionId?: string }>;
};

const QuestionPage: NextPage<PageProps> = async (props: PageProps) => {
  const { questionId } = await props.params;
  if (!questionId) {
    return null;
  }
  return <Quiz questionId={questionId} />;
};

export default QuestionPage;
