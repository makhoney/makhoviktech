"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { projects } from "../lib/projects";

export default function Home() {
  // ---------- ЛОГИКА КАРУСЕЛИ ----------
  const railRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  // стабильные "константы" для расчёта
  const cardWidth = 960;
  const gap = 32;

  // drag-to-scroll состояние
  const drag = useRef({ active: false, startX: 0, moved: false });

  function onPointerDown(e: React.PointerEvent) {
    drag.current = { active: true, startX: e.clientX, moved: false };
    (e.currentTarget as HTMLElement).classList.add("cursor-grabbing");
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.active || !railRef.current) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 2) {
      drag.current.moved = true;
      railRef.current.scrollLeft -= dx;
      drag.current.startX = e.clientX;
    }
  }

  function onPointerUp() {
    drag.current.active = false;
    (railRef.current as HTMLElement | null)?.classList.remove("cursor-grabbing");
  }

  function handleAnchorClick(e: React.MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault(); // был перетаскивающий жест — не навигируем
      drag.current.moved = false;
    }
  }

  function onScroll() {
    const rail = railRef.current;
    if (!rail) return;
    const w = (rail.firstElementChild as HTMLElement | null)?.clientWidth ?? cardWidth;
    const idx = Math.round(rail.scrollLeft / (w + gap));
    setActive(Math.max(0, Math.min(idx, projects.length - 1)));
  }

  // стабильная функция прокрутки к индексу
  const scrollToIndex = useCallback((i: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-card]");
    const w = card?.clientWidth ?? cardWidth;
    rail.scrollTo({ left: i * (w + gap), behavior: "smooth" });
  }, []);

  const prev = useCallback(() => {
    setActive((a) => {
      const nextIdx = Math.max(0, a - 1);
      scrollToIndex(nextIdx);
      return nextIdx;
    });
  }, [scrollToIndex]);

  const next = useCallback(() => {
    setActive((a) => {
      const nextIdx = Math.min(projects.length - 1, a + 1);
      scrollToIndex(nextIdx);
      return nextIdx;
    });
  }, [scrollToIndex]);

  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [prev, next]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#040313] via-[#050b1f] to-[#040313] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-[-12rem] h-[28rem] w-[28rem] rounded-full bg-violet-600/35 blur-3xl" />
        <div className="absolute right-[-10rem] top-[6rem] h-[26rem] w-[26rem] rounded-full bg-indigo-500/25 blur-[140px]" />
        <div className="absolute left-1/2 top-[26rem] h-[22rem] w-[36rem] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),_transparent_60%)]" />
        <svg
          className="absolute inset-x-0 bottom-0 h-56 w-full opacity-60"
          viewBox="0 0 1440 320"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="mountainGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(99,102,241,0.45)" />
              <stop offset="100%" stopColor="rgba(17,24,39,0.25)" />
            </linearGradient>
          </defs>
          <path
            d="M0,224L80,202.7C160,181,320,139,480,122.7C640,107,800,117,960,144C1120,171,1280,213,1360,234.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            fill="url(#mountainGradient)"
          />
        </svg>
      </div>

      {/* ОБО МНЕ */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 text-center">
        <div className="absolute inset-x-8 top-10 -z-10 hidden h-[480px] rounded-[48px] border border-white/10 bg-white/5 backdrop-blur-xl sm:block" />
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/5 p-1 shadow-[0_25px_60px_-30px_rgba(99,102,241,0.8)]">
          <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-indigo-400/50">
            {/* Положи своё фото в public/me.jpg */}
            <Image src="/me.jpg" alt="Me" width={112} height={112} className="h-full w-full object-cover" />
          </div>
        </div>
        <h1 className="mx-auto max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-white via-indigo-200 to-sky-400 bg-clip-text text-transparent">
            MakhovikTech
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Разгоняем идеи в цифровые продукты 🚀
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#projects"
            className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-slate-100 transition hover:border-indigo-400 hover:bg-indigo-500/10"
          >
            Наши работы
          </a>
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_20px_45px_-20px_rgba(99,102,241,0.8)] transition hover:shadow-[0_30px_70px_-25px_rgba(56,189,248,0.7)]"
          >
            Связаться
          </a>
        </div>
      </section>

      {/* ПРОЕКТЫ — как на макете (3 карточки на десктопе) */}
      <section
        id="projects"
        className="relative mx-auto mt-10 max-w-6xl rounded-[40px] border border-white/10 bg-white/5 px-6 pb-16 pt-12 shadow-[0_40px_120px_-40px_rgba(13,16,35,0.9)] backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_60%)]" />
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Наши работы</h2>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-lg text-slate-100 transition hover:border-indigo-400/70 hover:bg-indigo-500/10"
            >
              ←
            </button>
            <button
              onClick={next}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-lg text-slate-100 transition hover:border-indigo-400/70 hover:bg-indigo-500/10"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex cursor-grab select-none gap-8 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {projects.map((p, i) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              onClick={handleAnchorClick}
              onDragStart={(e) => e.preventDefault()}
              data-card
              className="group relative aspect-[16/9] w-[88vw] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/15 bg-slate-900/40 shadow-[0_45px_120px_-60px_rgba(15,23,42,0.9)] transition duration-500 hover:-translate-y-2 hover:border-indigo-400/80 hover:shadow-[0_65px_140px_-60px_rgba(79,70,229,0.85)] sm:w-[70vw] lg:w-[560px]"
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 70vw, 560px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]"
                priority={i === 0}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 space-y-1 text-white drop-shadow-lg">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-200/80">{p.desc}</p>
                <h3 className="text-3xl font-extrabold leading-tight">{p.name}</h3>
              </div>
            </a>
          ))}
        </div>

        {/* Точки-индикаторы */}
        <div className="mt-6 flex justify-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Слайд ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                i === active
                  ? "bg-indigo-400 shadow-[0_0_0_4px_rgba(129,140,248,0.18)]"
                  : "bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section
        id="contact"
        className="relative mx-auto mt-20 max-w-3xl rounded-[36px] border border-white/10 bg-white/5 px-6 pb-24 pt-16 shadow-[0_35px_120px_-50px_rgba(13,16,35,0.95)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[36px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_65%)]" />
        <h2 className="mb-6 text-center text-4xl font-extrabold tracking-tight text-white">Связаться</h2>
        <form className="grid gap-4">
          <input
            name="name"
            placeholder="Ваше имя"
            className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <textarea
            name="message"
            placeholder="Сообщение"
            rows={5}
            className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <button className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_20px_60px_-30px_rgba(99,102,241,0.85)] transition hover:shadow-[0_30px_90px_-35px_rgba(56,189,248,0.9)]">
            Отправить
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-300">
          Или напрямую:{" "}
          <a href="mailto:makhovik.test@gmail.com" className="underline decoration-indigo-400/70 decoration-2 underline-offset-4">
            makhovik.test@gmail.com
          </a>{" "}
          ·{" "}
          <a
            href="https://t.me/makhovikk"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-indigo-400/70 decoration-2 underline-offset-4"
          >
            @makhovikk
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/makhoney"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-indigo-400/70 decoration-2 underline-offset-4"
          >
            GitHub
          </a>
        </div>
      </section>

      <footer className="mt-20 border-t border-white/10 bg-slate-950/80 py-8 text-center text-sm text-slate-400 backdrop-blur">
        © {new Date().getFullYear()} MakhovikTech
      </footer>
    </main>
  );
}
