import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { QuestionForm } from "@/components/admin/QuestionForm";
import { BackLink } from "@/components/admin/BackLink";
import { updateQuestionAction } from "../../actions";

export default async function EditarPreguntaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) notFound();

  const boundAction = updateQuestionAction.bind(null, id);

  return (
    <div>
      <BackLink href="/admin/preguntas" label="Volver a preguntas" />
      <h1 className="mb-6 text-2xl font-bold text-amber-600 dark:text-amber-400">Editar pregunta</h1>
      <QuestionForm
        action={boundAction}
        submitLabel="Guardar cambios"
        defaults={{
          text: question.text,
          optionA: question.optionA,
          optionB: question.optionB,
          optionC: question.optionC,
          optionD: question.optionD,
          correctOption: question.correctOption,
          difficulty: question.difficulty,
          category: question.category,
          bibleVersion: question.bibleVersion,
          verseRef: question.verseRef,
          verseText: question.verseText,
          active: question.active,
        }}
      />
    </div>
  );
}
