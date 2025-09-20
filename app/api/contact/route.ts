import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Заполните все поля" }, { status: 400 });
    }

    // TODO: тут можно отправить письмо (SMTP, Resend) или записать в БД
    console.log("[CONTACT]", { name, email, message });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Ошибка" }, { status: 500 });
  }
}
