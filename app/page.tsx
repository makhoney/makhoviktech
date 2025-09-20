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
    <main className="min-h-screen">
      {/* ОБО МНЕ */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <div className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full ring-2 ring-gray-200">
          {/* Положи своё фото в public/me.jpg */}
          <Image src="/me.jpg" alt="Me" width={96} height={96} className="object-cover" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">MakhovikTech</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600">
          Разгоняем идеи в цифровые продукты 🚀
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <a href="#projects" className="rounded-xl border px-5 py-2 hover:bg-gray-50">Наши работы</a>
          <a href="#contact" className="rounded-xl bg-black px-5 py-2 text-white hover:opacity-90">Связаться</a>
        </div>
      </section>

      {/* ПРОЕКТЫ — как на макете (3 карточки на десктопе) */}
      <section id="projects" className="mx-auto max-w-6xl px-4 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Наши работы</h2>
          <div className="flex gap-2">
            <button onClick={prev} className="rounded-xl border px-3 py-1.5 hover:bg-gray-50">←</button>
            <button onClick={next} className="rounded-xl border px-3 py-1.5 hover:bg-gray-50">→</button>
          </div>
        </div>

        <div
          ref={railRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex gap-8 overflow-x-auto scroll-smooth pb-2 cursor-grab select-none"
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
              className="
                relative shrink-0 snap-start group overflow-hidden ring-1 ring-black/10 rounded-3xl
                w-[88vw] h-[50vw]            /* мобайл, почти фуллвью */
                sm:w-[70vw] sm:h-[39vw]      /* планшет */
                lg:w-[560px] lg:h-[315px]    /* десктоп ~16:9 и влезает 3 штуки */
              "
            >
              {/* Картинка 16:9, cover */}
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 70vw, 560px"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                priority={i === 0}
              />
              {/* Градиент снизу как на примере */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              {/* Текст внизу слева */}
              <div className="absolute inset-x-6 bottom-6 text-white">
                <p className="text-base opacity-90 leading-snug">{p.desc}</p>
                <h3 className="mt-1 text-3xl font-extrabold leading-tight">{p.name}</h3>
              </div>
            </a>
          ))}
        </div>

        {/* Точки-индикаторы */}
        <div className="mt-4 flex justify-center gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Слайд ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full ${i === active ? "bg-black" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contact" className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="mb-4 text-2xl font-bold">Связаться</h2>
        <form className="grid gap-3 rounded-2xl border p-4">
          <input name="name" placeholder="Ваше имя" className="rounded-lg border px-3 py-2" />
          <input name="email" type="email" placeholder="Email" className="rounded-lg border px-3 py-2" />
          <textarea name="message" placeholder="Сообщение" rows={5} className="rounded-lg border px-3 py-2" />
          <button className="rounded-xl bg-black px-5 py-2 text-white hover:opacity-90">Отправить</button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Или напрямую:{" "}
          <a href="mailto:youremail@example.com" className="underline">youremail@example.com</a> ·{" "}
          <a href="https://t.me/yourusername" target="_blank" rel="noreferrer" className="underline">@yourusername</a> ·{" "}
          <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="underline">GitHub</a>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MakhovikTech
      </footer>
    </main>
  );
}
