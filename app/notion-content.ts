import campaigns from "@/content/case-campaigns.json";
import designSystem from "@/content/case-design-system.json";
import gallery from "@/content/case-gallery.json";
import personalization from "@/content/case-personalization.json";
import settings from "@/content/case-settings.json";

export type NotionPayload = {
  title: string;
  text: string;
};

export type PortfolioCase = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  source: NotionPayload;
};

const settingsShots = new Map<string, string>([
  [
    "*Систематизация типовых элементов и настроек*",
    "![Превратил разрозненные шаблоны в систему](/media/settings-system-tall-5120.png)",
  ],
  [
    "*До / после: группировка панели настроек*",
    "![Снизил визуальный шум в панели настроек](/media/figma-shots/settings-noise.webp)",
  ],
  [
    "*Новая логика адаптивных размеров кнопки*",
    "![Частный кейс: адаптивные размеры кнопки](/media/figma-shots/settings-button.webp)",
  ],
  [
    "*Хлебные крошки и список вложенных элементов*",
    "![Сделал структуру блока видимой](/media/figma-shots/settings-structure.webp)",
  ],
  [
    "Самым объёмным стал прототип кликабельных областей и навигации между уровнями блока.",
    "![Как проверял решение](/media/settings-validation.webp)",
  ],
  [
    "*Точка входа в настройку динамического вывода*",
    "![Настройка динамического вывода продуктов](/media/figma-shots/shot-01.webp)",
  ],
]);

function withSettingsShots(source: NotionPayload): NotionPayload {
  const legacyValidationShot = "/486673bd-5d08-4f52-8638-4140e80709b9/image.png";
  const lines = source.text
    .split("\n")
    .filter((line) => !line.includes(legacyValidationShot));

  return {
    ...source,
    text: lines
      .flatMap((line) => {
        const shot = settingsShots.get(line.trim());
        return shot ? [line, shot] : [line];
      })
      .join("\n"),
  };
}

export const portfolioCases: PortfolioCase[] = [
  {
    slug: "email-builder-settings",
    title: "Пересборка настроек email-конструктора Mindbox",
    description:
      "Превратил разрозненные настройки блоков в единую масштабируемую систему. 14 крупных клиентов полностью перешли на новый конструктор.",
    icon: "🏗️",
    source: withSettingsShots(settings as NotionPayload),
  },
  {
    slug: "email-personalization",
    title: "Персонализация email-рассылок без HTML в Mindbox",
    description:
      "Перенёс работу с клиентскими и товарными данными из HTML в интерфейс конструктора. 113 клиентов начали запускать большую часть рассылок в новом инструменте.",
    icon: "🪄",
    source: personalization as NotionPayload,
  },
  {
    slug: "image-gallery",
    title: "Галерея изображений в Mindbox",
    description:
      "Спроектировал единое пространство для хранения и повторного использования изображений. Решение закрыло обращения 16 клиентов.",
    icon: "🖼️",
    source: gallery as NotionPayload,
  },
  {
    slug: "campaigns-redesign",
    title: "Редизайн раздела кампаний Mindbox",
    description:
      "Пересобрал один из центральных разделов Mindbox вокруг задач маркетолога и заложил основу нового визуального языка продукта.",
    icon: "📢",
    source: campaigns as NotionPayload,
  },
  {
    slug: "design-system",
    title: "Дизайн-система Mindbox",
    description:
      "Развивал компоненты и паттерны на основе реальных продуктовых сценариев: обновил базовые контролы, добавил недостающие состояния и описал правила использования.",
    icon: "/media/icon-figma.svg",
    source: designSystem as NotionPayload,
  },
];

export function getPortfolioCase(slug: string) {
  return portfolioCases.find((item) => item.slug === slug);
}
