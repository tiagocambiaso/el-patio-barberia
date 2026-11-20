import { NextResponse } from "next/server";
import {
  createTurnoAction,
  getOccupiedSlotsAction,
  listRecentTurnos,
} from "@/features/turnos/actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get("barberId");
    const dayId = searchParams.get("dayId");

    if (barberId && dayId) {
      const occupiedSlots = await getOccupiedSlotsAction(barberId, dayId);
      return NextResponse.json({ occupiedSlots }, { status: 200 });
    }

    const data = await listRecentTurnos(20);
    return NextResponse.json({ turnos: data }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/turnos] Error:", err);
    return NextResponse.json(
      { error: "No se pudieron obtener los turnos." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createTurnoAction(body);

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          slotConflict: result.slotConflict ?? false,
          fieldErrors: result.fieldErrors,
        },
        { status: result.slotConflict ? 409 : 400 },
      );
    }

    return NextResponse.json(
      { code: result.code, turno: result.turno, whatsappUrl: result.whatsappUrl },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/turnos] Error:", err);
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido." },
      { status: 400 },
    );
  }
}
