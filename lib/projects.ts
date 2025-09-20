// lib/projects.ts
export type Project = {
  name: string;      // Заголовок
  desc: string;      // Короткое описание
  url: string;       // Ссылка на проект
  image: string;     // Путь к картинке в /public
};

export const projects: Project[] = [
  {
    name: "Конвертер в 8-bit",
    desc: "MIDI → 8-bit трек за пару кликов.",
    url: "https://example-8bit.vercel.app",
    image: "/projects/8bit.png",
  },
  {
    name: "Калькулятор срока хранения",
    desc: "Определи срок годности блюда по ингредиентам.",
    url: "https://example-srok.vercel.app",
    image: "/projects/srok.png",
  },
  // добавляй ещё по этому шаблону
];
