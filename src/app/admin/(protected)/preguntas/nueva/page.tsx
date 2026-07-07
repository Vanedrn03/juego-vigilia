import { QuestionForm } from "@/components/admin/QuestionForm";
import { BackLink } from "@/components/admin/BackLink";
import { createQuestionAction } from "../actions";

export default function NuevaPreguntaPage() {
  return (
    <div>
      <BackLink href="/admin/preguntas" label="Volver a preguntas" />
      <h1 className="mb-6 text-2xl font-bold text-amber-400">Nueva pregunta</h1>
      <QuestionForm action={createQuestionAction} submitLabel="Crear pregunta" />
    </div>
  );
}
