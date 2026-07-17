import { FeudQuestionForm } from "@/components/admin/FeudQuestionForm";
import { BackLink } from "@/components/admin/BackLink";
import { createFeudQuestionAction } from "../actions";

export default function NuevaPreguntaCristianosPage() {
  return (
    <div>
      <BackLink href="/admin/cristianos/preguntas" label="Volver a preguntas" />
      <h1 className="mb-6 text-2xl font-bold text-amber-600 dark:text-amber-400">Nueva pregunta de encuesta</h1>
      <FeudQuestionForm action={createFeudQuestionAction} submitLabel="Crear pregunta" />
    </div>
  );
}
