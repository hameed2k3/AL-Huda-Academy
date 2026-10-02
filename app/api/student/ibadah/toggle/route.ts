import { NextResponse } from "next/server";
import { getStudentSession } from "@/lib/student-auth";
import {
  togglePrayerCompletion,
  toggleDuaCompletion,
  toggleDhikrCompletion,
  getStudentDaySummary,
} from "@/lib/ibadah-repository";

export async function POST(request: Request) {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      type: "prayer" | "dua" | "dhikr";
      itemId: string;
      date: string;
    };

    const todayStr = new Date().toISOString().slice(0, 10);
    // Important business rule: Only allow toggling for today's active date to protect historical integrity
    if (body.date !== todayStr) {
      return NextResponse.json(
        { ok: false, message: "Historical records cannot be modified directly." },
        { status: 400 },
      );
    }

    let result;
    if (body.type === "prayer") {
      result = await togglePrayerCompletion(session.studentId, body.itemId, body.date);
    } else if (body.type === "dua") {
      result = await toggleDuaCompletion(session.studentId, body.itemId, body.date);
    } else if (body.type === "dhikr") {
      result = await toggleDhikrCompletion(session.studentId, body.itemId, body.date);
    } else {
      return NextResponse.json({ ok: false, message: "Invalid activity type." }, { status: 400 });
    }

    const updatedSummary = await getStudentDaySummary(session.studentId, body.date);

    return NextResponse.json({
      ok: true,
      data: {
        completed: result.completed,
        summary: updatedSummary,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to update activity." },
      { status: 500 },
    );
  }
}
