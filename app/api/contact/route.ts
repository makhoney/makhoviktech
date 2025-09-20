import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Заполните все поля" }, { status: 400 });
    }
    console.log("[CONTACT]", { name, email, message });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) { // ← было (e: any)
    const message = err instanceof Error ? err.message : "Ошибка";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
