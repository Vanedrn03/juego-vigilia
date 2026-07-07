"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function updateLadderAction(formData: FormData) {
  for (let step = 1; step <= 15; step++) {
    const label = formData.get(`label-${step}`);
    const points = formData.get(`points-${step}`);
    const isCheckpoint = formData.get(`checkpoint-${step}`) === "on";

    if (typeof label !== "string" || typeof points !== "string") continue;

    await prisma.prizeLevel.upsert({
      where: { step },
      update: { label, points: Number(points), isCheckpoint },
      create: { step, label, points: Number(points), isCheckpoint },
    });
  }

  revalidatePath("/admin/escalera");
}
