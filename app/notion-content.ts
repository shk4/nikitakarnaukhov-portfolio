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
  cover: string;
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
    "![Как проверял решение](/media/settings-validation.png)",
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

function withPersonalizationAnimation(source: NotionPayload): NotionPayload {
  const sectionMedia =
    '<unknown url="https://app.notion.com/p/496dc95a74b78366981981733c51b114#38fdc95a74b7829093518143dbee79b4" alt="figma"/>';

  return {
    ...source,
    text: source.text.replace(
      sectionMedia,
      `![Окна добавления и редактирования переменных](/media/personalization-live-mosaic-2k.mp4)\n${sectionMedia}`,
    ).replace(
      '<unknown url="https://app.notion.com/p/496dc95a74b78366981981733c51b114#a9fdc95a74b782418d378173cd6befd9"',
      '![Систематизация цен и скидок](/media/discount-system-motion)\n<unknown url="https://app.notion.com/p/496dc95a74b78366981981733c51b114#a9fdc95a74b782418d378173cd6befd9"',
    ),
  };
}

export const portfolioCases: PortfolioCase[] = [
  {
    slug: "email-builder-settings",
    title: "Пересборка настроек email-конструктора Mindbox",
    description:
      "Превратил разрозненные настройки блоков в единую масштабируемую систему. 14 крупных клиентов полностью перешли на новый конструктор.",
    icon: "🏗️",
    cover: "/media/cover-settings.png",
    source: withSettingsShots(settings as NotionPayload),
  },
  {
    slug: "email-personalization",
    title: "Персонализация email-рассылок без HTML в Mindbox",
    description:
      "Перенёс работу с клиентскими и товарными данными из HTML в интерфейс конструктора. 113 клиентов начали запускать большую часть рассылок в новом инструменте.",
    icon: "🪄",
    cover: "/media/cover-personalization-main.png",
    source: withPersonalizationAnimation(personalization as NotionPayload),
  },
  {
    slug: "image-gallery",
    title: "Галерея изображений в Mindbox",
    description:
      "Спроектировал единое пространство для хранения и повторного использования изображений. Решение закрыло обращения 16 клиентов.",
    icon: "🖼️",
    cover: "/media/cover-gallery.png",
    source: gallery as NotionPayload,
  },
  {
    slug: "campaigns-redesign",
    title: "Редизайн раздела кампаний Mindbox",
    description:
      "Пересобрал один из центральных разделов Mindbox вокруг задач маркетолога и заложил основу нового визуального языка продукта.",
    icon: "📢",
    cover: "/media/cover-campaigns.png",
    source: campaigns as NotionPayload,
  },
  {
    slug: "design-system",
    title: "Дизайн-система Mindbox",
    description:
      "Развивал компоненты и паттерны на основе реальных продуктовых сценариев: обновил базовые контролы, добавил недостающие состояния и описал правила использования.",
    icon: "/media/icon-figma.svg",
    cover: "/media/cover-design-system.png",
    source: designSystem as NotionPayload,
  },
];

export function getPortfolioCase(slug: string) {
  return portfolioCases.find((item) => item.slug === slug);
}
