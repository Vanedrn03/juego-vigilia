"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { feudQuestionSchema } from "@/lib/validation/feudQuestion";

function parseFormData(formData: FormData) {
  const count = Number(formData.get("answerCount") ?? 0);
  const answers = Array.from({ length: count }, (_, i) => ({
    text: formData.get(`answerText-${i}`),
    points: formData.get(`answerPoints-${i}`),
  }));

  return {
    text: formData.get("text"),
    active: formData.get("active") === "on",
    answers,
  };
}

export async function createFeudQuestionAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = feudQuestionSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { text, active, answers } = parsed.data;
  await prisma.feudQuestion.create({
    data: {
      text,
      active,
      answers: {
        create: answers.map((a, i) => ({ text: a.text, points: a.points, rank: i + 1 })),
      },
    },
  });

  revalidatePath("/admin/cristianos/preguntas");
  redirect("/admin/cristianos/preguntas");
}

export async function updateFeudQuestionAction(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = feudQuestionSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { text, active, answers } = parsed.data;
  await prisma.$transaction([
    prisma.feudQuestion.update({ where: { id }, data: { text, active } }),
    prisma.feudAnswer.deleteMany({ where: { questionId: id } }),
    prisma.feudAnswer.createMany({
      data: answers.map((a, i) => ({ questionId: id, text: a.text, points: a.points, rank: i + 1 })),
    }),
  ]);

  revalidatePath("/admin/cristianos/preguntas");
  redirect("/admin/cristianos/preguntas");
}

export async function deleteFeudQuestionAction(id: string) {
  const usedCount = await prisma.feudSessionRound.count({ where: { questionId: id } });

  if (usedCount > 0) {
    await prisma.feudQuestion.update({ where: { id }, data: { active: false } });
  } else {
    await prisma.feudQuestion.delete({ where: { id } });
  }

  revalidatePath("/admin/cristianos/preguntas");
}

export async function toggleFeudQuestionActiveAction(id: string, active: boolean) {
  await prisma.feudQuestion.update({ where: { id }, data: { active } });
  revalidatePath("/admin/cristianos/preguntas");
}
