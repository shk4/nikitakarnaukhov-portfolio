export const projectArt = {
  "email-builder-settings": { title: "Сложный конструктор. Простые настройки.", short: "Email-конструктор", tag: "Системный редизайн", image: "/media/figma-shots/settings-structure.webp", result: "14", resultLabel: "крупных клиентов перешли на новый конструктор", tone: "silver" },
  "email-personalization": { title: "Персонализация без единой строчки HTML.", short: "Персонализация", tag: "Новый опыт", image: "/media/figma-shots/shot-03.webp", result: "113", resultLabel: "клиентов запускают большую часть рассылок в новом инструменте", tone: "blue" },
  "image-gallery": { title: "Всё нужное — в одной галерее.", short: "Галерея изображений", tag: "Продукт с нуля", image: "/media/figma-shots/shot-07.webp", result: "16", resultLabel: "клиентов получили решение своих задач", tone: "sand" },
  "campaigns-redesign": { title: "Кампании, собранные вокруг задач.", short: "Кампании", tag: "Новый визуальный язык", image: "/media/figma-shots/shot-09.webp", result: "01", resultLabel: "единый визуальный язык для дальнейшего развития продукта", tone: "green" },
  "design-system": { title: "От компонентов — к целой системе.", short: "Дизайн-система", tag: "Компоненты и паттерны", image: "/media/figma-shots/ds-1.webp", result: "07", resultLabel: "групп компонентов и правила их использования", tone: "rose" },
} as const;
export type ProjectSlug = keyof typeof projectArt;
