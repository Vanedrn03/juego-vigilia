import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FeudQuestionForm } from "@/components/admin/FeudQuestionForm";
import { BackLink } from "@/components/admin/BackLink";
import { updateFeudQuestionAction } from "../../actions";

export default async function EditarPreguntaCristianosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = await prisma.feudQuestion.findUnique({
    where: { id },
    include: { answers: { orderBy: { rank: "asc" } } },
  });
  if (!question) notFound();

  const boundAction = updateFeudQuestionAction.bind(null, id);

  return (
    <div>
      <BackLink href="/admin/cristianos/preguntas" label="Volver a preguntas" />
      <h1 className="mb-6 text-2xl font-bold text-amber-600 dark:text-amber-400">Editar pregunta de encuesta</h1>
      <FeudQuestionForm
        action={boundAction}
        submitLabel="Guardar cambios"
        defaults={{
          text: question.text,
          active: question.active,
          answers: question.answers.map((a) => ({ text: a.text, points: a.points })),
        }}
      />
    </div>
  );
}
