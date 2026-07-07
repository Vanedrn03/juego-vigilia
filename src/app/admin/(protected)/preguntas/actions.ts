"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { questionSchema } from "@/lib/validation/question";

function parseFormData(formData: FormData) {
  return {
    text: formData.get("text"),
    optionA: formData.get("optionA"),
    optionB: formData.get("optionB"),
    optionC: formData.get("optionC"),
    optionD: formData.get("optionD"),
    correctOption: formData.get("correctOption"),
    difficulty: formData.get("difficulty"),
    category: formData.get("category"),
    bibleVersion: formData.get("bibleVersion") || "RV60",
    verseRef: formData.get("verseRef"),
    verseText: formData.get("verseText"),
    active: formData.get("active") === "on",
  };
}

export async function createQuestionAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = questionSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.question.create({ data: parsed.data });
  revalidatePath("/admin/preguntas");
  redirect("/admin/preguntas");
}

export async function updateQuestionAction(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = questionSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.question.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/preguntas");
  redirect("/admin/preguntas");
}

export async function deleteQuestionAction(id: string) {
  const usedCount = await prisma.sessionQuestion.count({
    where: { questionId: id },
  });

  if (usedCount > 0) {
    await prisma.question.update({ where: { id }, data: { active: false } });
  } else {
    await prisma.question.delete({ where: { id } });
  }

  revalidatePath("/admin/preguntas");
}

export async function toggleQuestionActiveAction(id: string, active: boolean) {
  await prisma.question.update({ where: { id }, data: { active } });
  revalidatePath("/admin/preguntas");
}
