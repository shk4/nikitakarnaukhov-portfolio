import { StudioArt, hasStudioArt } from "./studio-art";
import { DiscountMotion } from "./discount-motion";
import { shotPresentation } from "./shot-presentation";
import { mediaDimensions } from "./media-dimensions";
import type { CSSProperties, ReactNode } from "react";
import { FigmaDisclosure } from "@/app/figma-disclosure";
import { typograph } from "./typography";

type BlockNode = {
  type:
    | "columns"
    | "column"
    | "callout"
    | "heading"
    | "paragraph"
    | "list"
    | "image"
    | "embed"
    | "empty"
    | "divider";
  text?: string;
  level?: number;
  color?: string;
  icon?: string;
  index?: number;
  ratio?: number;
  highlight?: boolean;
  url?: string;
  items?: string[];
  children?: BlockNode[];
};

function attr(line: string, name: string) {
  return line.match(new RegExp(`${name}="([^"]*)"`))?.[1];
}

function cleanInlineSource(value: string) {
  return value
    .replace(/\s*\{color="[^"]+"\}\s*$/g, "")
    .replace(/<span[^>]*>/g, "")
    .replace(/<\/span>/g, "")
    .trim();
}

function cleanHeadingSource(value: string) {
  return cleanInlineSource(value)
    .replace(/^(?:\p{Extended_Pictographic}|\uFE0F|\u200D)+\s*/u, "")
    .trim();
}

function parseSequence(
  lines: string[],
  start: number,
  closingTag?: string,
): [BlockNode[], number] {
  const nodes: BlockNode[] = [];
  let index = start;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (closingTag && line === closingTag) {
      return [nodes, index + 1];
    }

    if (!line) {
      index += 1;
      continue;
    }

    if (line === "<columns>") {
      const [children, next] = parseSequence(lines, index + 1, "</columns>");
      nodes.push({ type: "columns", children });
      index = next;
      continue;
    }

    if (line.startsWith("<column")) {
      const ratio = Number(attr(line, "ratio"));
      const [children, next] = parseSequence(lines, index + 1, "</column>");
      nodes.push({
        type: "column",
        ratio: Number.isFinite(ratio) && ratio > 0 ? ratio : 1,
        children,
      });
      index = next;
      continue;
    }

    if (line.startsWith("<callout")) {
      const [children, next] = parseSequence(lines, index + 1, "</callout>");
      nodes.push({
        type: "callout",
        icon: attr(line, "icon") || "•",
        color: attr(line, "color") || "gray_bg",
        children,
      });
      index = next;
      continue;
    }

    if (line.startsWith("<unknown")) {
      const fallbackUrl = attr(line, "url");
      let nextIndex = index + 1;

      while (nextIndex < lines.length && !lines[nextIndex].trim()) {
        nextIndex += 1;
      }

      const figmaLink = lines[nextIndex]
        ?.trim()
        .match(/^\[([^\]]+)\]\((https:\/\/(?:www\.)?figma\.com\/.+)\)$/);

      nodes.push({
        type: "embed",
        text: figmaLink?.[1] || "Интерактивный макет в Figma",
        url: figmaLink?.[2] || fallbackUrl,
      });
      index = figmaLink ? nextIndex + 1 : index + 1;
      continue;
    }

    if (line === "<empty-block/>") {
      nodes.push({ type: "empty" });
      index += 1;
      continue;
    }

    if (line === "---") {
      nodes.push({ type: "divider" });
      index += 1;
      continue;
    }

    const imageMatch = line.match(/^!\[([^\]]*)\]\((.+)\)$/);
    if (imageMatch) {
      nodes.push({ type: "image", text: imageMatch[1], url: imageMatch[2] });
      index += 1;
      continue;
    }

    const standaloneFigmaLink = line.match(
      /^\[([^\]]+)\]\((https:\/\/(?:www\.)?figma\.com\/.+)\)$/,
    );
    if (standaloneFigmaLink) {
      nodes.push({
        type: "embed",
        text: standaloneFigmaLink[1],
        url: standaloneFigmaLink[2],
      });
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const source = headingMatch[2];
      nodes.push({
        type: "heading",
        level: headingMatch[1].length,
        text: cleanHeadingSource(source),
        highlight:
          source.includes('{color="yellow"}') || source.includes('color="yellow"'),
      });
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      nodes.push({ type: "list", items });
      continue;
    }

    if (line.startsWith("<") && line.endsWith(">")) {
      index += 1;
      continue;
    }

    nodes.push({ type: "paragraph", text: cleanInlineSource(line) });
    index += 1;
  }

  return [nodes, index];
}

function renderInline(source = ""): ReactNode[] {
  const result: ReactNode[] = [];
  const normalized = typograph(cleanInlineSource(source));
  const token = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|`[^`]+`|<br\s*\/?>)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = token.exec(normalized))) {
    if (match.index > cursor) result.push(normalized.slice(cursor, match.index));
    const value = match[0];
    const key = `${match.index}-${value.length}`;

    if (value.startsWith("**")) {
      result.push(<strong key={key}>{value.slice(2, -2)}</strong>);
    } else if (value.startsWith("[")) {
      const link = value.match(/^\[([^\]]+)\]\((.+)\)$/);
      if (link) {
        const external = /^https?:\/\//.test(link[2]);
        result.push(
          <a
            href={link[2]}
            key={key}
            rel={external ? "noreferrer" : undefined}
            target={external ? "_blank" : undefined}
          >
            {renderInline(link[1])}
          </a>,
        );
      }
    } else if (value.startsWith("*")) {
      result.push(<em key={key}>{value.slice(1, -1)}</em>);
    } else if (value.startsWith("`")) {
      result.push(<code key={key}>{value.slice(1, -1)}</code>);
    } else {
      result.push(<br key={key} />);
    }
    cursor = match.index + value.length;
  }

  if (cursor < normalized.length) result.push(normalized.slice(cursor));
  return result;
}

function localMediaUrl(url = "") {
  const match = url.match(/\/([^/]+)\/image\.png(?:\?|$)/);
  return match ? `/media/${match[1]}.png` : url;
}

function isWideCaseShot(url = "") {
  return /\/media\/settings-(?:system(?:-7680)?|validation)\.png$/.test(url);
}

function figmaEmbedUrl(url = "") {
  try {
    const embed = new URL(url);
    embed.hostname = "embed.figma.com";
    embed.searchParams.set("embed-host", "notion-portfolio");
    return embed.toString();
  } catch {
    return undefined;
  }
}

function renderCaseMetadata(node: BlockNode, key: string) {
  const columns = node.children || [];

  const groupColumnItems = (column: BlockNode) => {
    const groups: BlockNode[][] = [];

    for (const child of column.children || []) {
      if (child.type === "empty") continue;

      if (child.type === "heading" && child.level === 4) {
        groups.push([child]);
      } else if (groups.length > 0) {
        groups[groups.length - 1].push(child);
      } else {
        groups.push([child]);
      }
    }

    return groups;
  };

  return (
    <div className="case-meta-columns" key={key}>
      {columns.map((column, columnIndex) => (
        <div className="case-meta-stack" key={`${key}-${columnIndex}`}>
          {groupColumnItems(column).map((group, groupIndex) => (
            <section
              className="case-meta-item"
              key={`${key}-${columnIndex}-${groupIndex}`}
            >
              {group.map((child, childIndex) =>
                renderNode(
                  child,
                  `${key}-${columnIndex}-${groupIndex}-${childIndex}`,
                ),
              )}
            </section>
          ))}
        </div>
      ))}
    </div>
  );
}

function isMainTakeawayCallout(node: BlockNode) {
  if (node.type !== "callout") return false;

  const firstParagraph = (node.children || []).find(
    (child) => child.type === "paragraph",
  );
  const text = (firstParagraph?.text || "").replace(/\*\*/g, "").trim();
  return /^Главный вывод\s*:/i.test(text);
}

function renderCaseLede(node: BlockNode, key: string) {
  return (
    <div className="case-lede" key={key}>
      {(node.children || []).map((child, index) => {
        if (child.type === "paragraph") {
          return (
            <p className="notion-paragraph" key={`${key}-${index}`}>
              {renderInline((child.text || "").replace(/\*\*/g, ""))}
            </p>
          );
        }

        return renderNode(child, `${key}-${index}`);
      })}
    </div>
  );
}

function capitalizeFirst(value: string) {
  return value.replace(/^(\s*(?:\*\*|\*)?)(\p{L})/u, (_, prefix, letter) => prefix + letter.toLocaleUpperCase("ru-RU"));
}

function resultCategory(title: string, number: number): string {
  if (/^Что изменилось для продукта/i.test(title)) return "Продуктовый эффект";
  if (/^Скорость создания персонализированной рассылки/i.test(title)) return "Дополнительный эффект";
  if (/^Основа дизайн-системы/i.test(title)) return "Системный эффект";
  if (/^Скорость и стабильность/i.test(title)) return "Технический эффект";
  if (number === 3 && /Влияние на переход/i.test(title)) return "Дополнительный эффект";
  return "Цель";
}

function semanticCalloutContent(node: BlockNode) {
  const children = [...(node.children || [])];
  const fallbackTitle = node.icon === "🚧" ? "Проблема" : "Что изменилось";
  const first = children[0];

  if (first?.type !== "paragraph") {
    return { title: fallbackTitle, children };
  }

  const match = (first.text || "").match(/^\*\*([^*]+)\*\*\s*([\s\S]*)$/);
  if (!match) return { title: fallbackTitle, children };

  const title = match[1].replace(/[.:]\s*$/, "").trim() || fallbackTitle;
  children[0] = { ...first, text: capitalizeFirst(match[2].trim()) };
  return { title, children };
}

function isMetricBaseline(node: BlockNode) {
  return node.type === "paragraph" && /^Было\s.+·\s*цель/i.test(node.text || "");
}

function renderNode(node: BlockNode, key: string): ReactNode {
  if (node.type === "columns") {
    const columns = node.children || [];
    const template = columns.map((column) => `${column.ratio || 1}fr`).join(" ");
    return (
      <div
        className="notion-columns"
        key={key}
        style={{ gridTemplateColumns: template } as CSSProperties}
      >
        {columns.map((child, index) => renderNode(child, `${key}-${index}`))}
      </div>
    );
  }

  if (node.type === "column") {
    return (
      <div className="notion-column" key={key}>
        {(node.children || []).map((child, index) =>
          renderNode(child, `${key}-${index}`),
        )}
      </div>
    );
  }

  if (node.type === "callout") {
    if (node.icon === "🚧" || node.icon === "→") {
      const semantic = semanticCalloutContent(node);

      return (
        <section className={`notion-semantic-callout ${node.icon === "🚧" ? "semantic-problem" : "semantic-outcome"}`} key={key}>
          <h4 className="notion-heading notion-heading--3 notion-semantic-callout__heading case-step-label">
            {semantic.title}
          </h4>
          <div className="notion-semantic-callout__body">
            {semantic.children.map((child, index) =>
              renderNode(child, `${key}-${index}`),
            )}
          </div>
        </section>
      );
    }

    const first = node.children?.[0];
    const title = first?.type === "paragraph" ? first.text || "" : "";
    const isResult = node.icon === "✨";
    const fullTitle = /^\*\*([\s\S]*)\*\*$/.test(title);
    const metric = isResult && !/^\*\*4 клиента полностью перешли/.test(title) ? title.replace(/\*\*/g, "").match(/^(\d+(?:[,.]\d+)?)(.*)$/) : null;
    const contentNodes = (node.children || []).slice(fullTitle || metric ? 1 : 0);
    return (
      <aside className={`case-note ${isResult ? "case-note--result" : "case-note--aside"} ${metric ? "case-note--metric" : ""}`} key={key}>
        <div className="case-note__mark" aria-hidden="true">{metric ? metric[1] : isResult ? String(node.index || 1).padStart(2, "0") : <svg viewBox="0 0 24 24" fill="none"><path d="M4 12h16M12 4v16M5.5 5.5l13 13M18.5 5.5l-13 13" stroke="currentColor" strokeWidth="1.5"/></svg>}</div>
        <div className="case-note__content">
          {(fullTitle || metric) && <h4 className="case-note__title">{renderInline(metric ? capitalizeFirst(metric[2].trim()) : title.replace(/^\*\*|\*\*$/g, ""))}</h4>}
          {isResult ? <>
            <div className="case-result-description">{contentNodes.filter(child => !isMetricBaseline(child)).map((child, index) => renderNode(child, `${key}-description-${index}`))}</div>
            {contentNodes.filter(isMetricBaseline).map((child, index) => renderNode(child, `${key}-baseline-${index}`))}
          </> : contentNodes.map((child, index) => renderNode(child, `${key}-${index}`))}
        </div>
      </aside>
    );
  }

  if (node.type === "heading") {
    const content = (
      <span className={node.highlight ? "notion-highlight" : undefined}>
        {renderInline(node.text)}
      </span>
    );
    const isSolutionLabel = node.level === 3 && (node.text || "").replace(/\*\*/g, "").trim() === "Решение";
    const className = `notion-heading notion-heading--${node.level}${isSolutionLabel ? " case-step-label" : ""}`;
    if (node.level === 1) return <h2 className={className} key={key}>{content}</h2>;
    if (node.level === 2) return <h3 className={className} key={key}>{content}</h3>;
    if (node.level === 3) return <h4 className={className} key={key}>{content}</h4>;
    return <h5 className={className} key={key}>{content}</h5>;
  }

  if (node.type === "paragraph" && (node.text || "").includes("После переноса из рабочей Figma")) {
    return <aside className="case-note case-note--aside case-note--figma" key={key}><div className="case-note__mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 12h16M12 4v16M5.5 5.5l13 13M18.5 5.5l-13 13" stroke="currentColor" strokeWidth="1.5"/></svg></div><div className="case-note__content"><p className="notion-paragraph">{renderInline((node.text || "").replace(/^\*|\*$/g, ""))}</p></div></aside>;
  }

  if (node.type === "paragraph") {
    return (
      <p className={`notion-paragraph${isMetricBaseline(node) ? " case-metric-baseline" : ""}`} key={key}>
        {renderInline(node.text)}
      </p>
    );
  }

  if (node.type === "list") {
    return (
      <ul className="notion-list" role="list" key={key}>
        {(node.items || []).map((item, index) => (
          <li key={`${key}-${index}`}>{renderInline(item)}</li>
        ))}
      </ul>
    );
  }

  if (node.type === "image") {
    const imageUrl = localMediaUrl(node.url);
    if (hasStudioArt(imageUrl)) return <figure className="notion-figure" key={key}><div className="media-clip"><StudioArt file={imageUrl.split("/").pop()!}/></div></figure>;
    if (imageUrl === "/media/discount-system-motion") return <figure className="notion-figure" key={key}><DiscountMotion /></figure>;
    if (imageUrl === "/media/figma-shots/shot-01.webp") return <figure className="notion-figure" key={key}><div className="media-clip"><video src="/media/settings-product-scenario.mp4" autoPlay muted loop playsInline preload="metadata" width={2796} height={1570} aria-label="Настройка динамического вывода продуктов" /></div></figure>;
    const presentation = shotPresentation(imageUrl);
    const isPersonalizationAnimation =
      imageUrl === "/media/personalization-live-mosaic-2k.mp4";
    if (imageUrl === "/media/settings-system-tall-5120.png" || isPersonalizationAnimation) {
      return (
        <figure className="notion-figure" key={key}>
          <div className="media-clip media-clip--animation"><video
            src={isPersonalizationAnimation
              ? "/media/personalization-studio-smooth-2k.mp4?v=original-motion-2"
              : "/media/settings-islands-studio-2k.mp4?v=gray-1"}
            poster={isPersonalizationAnimation
              ? "/media/personalization-studio-poster.png?v=gray-1"
              : "/media/settings-islands-studio-poster.png?v=gray-1"}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            width={2560}
            height={1200}
            aria-label={node.text || "Настройки конструктора"}
          /></div>
        </figure>
      );
    }
    const className = [
      "/media/settings-system-tall-5120.png",
      "/media/settings-validation.png",
    ].includes(imageUrl)
      ? "notion-figure"
      : isWideCaseShot(imageUrl)
      ? "notion-figure notion-figure--wide"
      : "notion-figure";

    return (
      <figure className={className} key={key}>
        <div className={`media-clip${imageUrl.endsWith("shot-08.webp") ? " media-clip--gallery-top" : ""}`} style={presentation?.surface}>
        <img
          style={presentation?.image}
          alt={node.text || "Иллюстрация проекта"}
          decoding="async"
          loading="lazy"
          src={imageUrl}
          width={mediaDimensions[imageUrl]?.width}
          height={mediaDimensions[imageUrl]?.height}
          className={imageUrl.includes("settings-noise") ? "source-rounded source-rounded--noise" : imageUrl.includes("settings-structure") ? "source-rounded source-rounded--structure" : undefined}
        />
        {imageUrl.endsWith("shot-09.webp") && <svg className="browser-dark-chrome" viewBox="0 0 1800 1200" aria-hidden="true"><path d="M50 120V68Q50 50 68 50H1732Q1750 50 1750 68V120Z" fill="#282b2b"/><path d="M50 120H1750" stroke="#282b2b"/><rect x="50" y="50" width="1700" height="1100" rx="17" fill="none" stroke="#282b2b" strokeWidth="2"/><circle cx="88" cy="85" r="10" fill="#ff6059"/><circle cx="126" cy="85" r="10" fill="#ffbd2e"/><circle cx="164" cy="85" r="10" fill="#28c840"/></svg>}
        {/\/shot-(04|05|10)\.webp$/.test(imageUrl) && <svg className="laptop-screen-corners" viewBox="0 0 1920 1280" aria-hidden="true"><path fill="#0c0d0d" fillRule="evenodd" d="M140 157H1781V1066H140Z M166 159H1755A24 24 0 0 1 1779 183V1040A24 24 0 0 1 1755 1064H166A24 24 0 0 1 142 1040V183A24 24 0 0 1 166 159Z"/></svg>}
        </div>
      </figure>
    );
  }

  if (node.type === "embed") {
    const isFigma = /^https:\/\/(?:www\.)?figma\.com\//.test(node.url || "");
    const embedUrl = isFigma ? figmaEmbedUrl(node.url) : undefined;

    return <FigmaDisclosure embedUrl={embedUrl} key={key} sourceUrl={node.url} />;
  }

  if (node.type === "divider") return <hr className="notion-divider" key={key} />;
  return <div className="notion-empty" key={key} aria-hidden="true" />;
}

export function NotionRenderer({ source }: { source: string }) {
  const content = source.match(/<content>\n([\s\S]*?)\n<\/content>/)?.[1] || "";
  const [parsedNodes] = parseSequence(content.split("\n"), 0);
  const nodes = parsedNodes.filter((node, index) => {
    if (isMainTakeawayCallout(node)) return false;
    if ((node.text || "").includes("После переноса из рабочей Figma")) return true;

    if (node.type !== "paragraph" || !/^\*[^*]+\*$/.test(node.text || "")) {
      return true;
    }

    const following = parsedNodes.slice(index + 1).filter((item) => item.type !== "empty");
    return !(
      following[0]?.type === "embed" ||
      (following[0]?.type === "image" && following[1]?.type === "embed")
    );
  });
  const metadataIndex = nodes.findIndex((node) => node.type === "columns");

  const groups: { heading?: BlockNode; body: BlockNode[] }[] = [];
  for (const node of nodes) {
    if (node.type === "empty") continue;
    if (node.type === "heading" && (node.level === 1 || node.level === 2)) {
      groups.push({ heading: node, body: [] });
    } else {
      if (!groups.length) groups.push({ body: [] });
      groups[groups.length - 1].body.push(node);
    }
  }
  const renderBody = (body: BlockNode[], groupIndex: number) => {
    const result: ReactNode[] = [];
    for (let i = 0; i < body.length; i++) {
      const node = body[i];
      const key = `group-${groupIndex}-${i}`;
      if (node.type === "callout" && node.icon === "✨") {
        const run: BlockNode[] = [];
        while (i < body.length && body[i].type === "callout" && body[i].icon === "✨") run.push(body[i++]);
        i--;
        result.push(<div className={`outcome-grid outcome-grid--${run.length}`} key={key}>{run.map((item, index) => renderNode({ ...item, index: index + 1 }, `${key}-${index}`))}</div>);
      } else if (groupIndex === 0 && i === 0 && node.type === "callout") {
        continue;
      } else if (node === nodes[metadataIndex]) {
        result.push(renderCaseMetadata(node, key));
      } else result.push(renderNode(node, key));
    }
    return result;
  };
  const detailedResultsIndex = groups.findIndex(group => /^Результаты подробнее$/i.test((group.heading?.text || "").replace(/\*\*/g, "").trim()));
  return <div className="notion-renderer">
    {groups.map((group, index) => {
      if (!group.heading) return <div className="case-overview" key={index}>{renderBody(group.body, index)}</div>;
      const title = (group.heading.text || "").replace(/\*\*/g, "");
      const number = title.match(/^(\d+)\.\s*/);
      const isDetail = /^Частный кейс:/i.test(title);
      const isIntro = group.heading.level === 1 && group.body.length === 0;
      const isResults = /результат/i.test(title);
      const isResultsDetails = index === detailedResultsIndex;
      const isResultDetail = detailedResultsIndex >= 0 && index > detailedResultsIndex;
      const isSummary = group.heading.level === 1 && /^Результат(?: в цифрах)?$/i.test(title);
      const isValidation = /^Как проверял решение$/i.test(title);
      const caption = isResultsDetails || isSummary || isValidation || isIntro
        || /^(Контекст|Мой вклад|От анализа до запуска)$/i.test(title)
        || /мотивация|проект был важен/i.test(title) ? null
        : isResultDetail ? `${resultCategory(title, index - detailedResultsIndex)} / ${String(index - detailedResultsIndex).padStart(2, "0")}`
        : number ? `Решение / ${number[1].padStart(2, "0")}`
        : isDetail ? "Частный кейс"
        : "О проекте";
      return <section className={`case-chapter ${number ? "case-chapter--step" : ""} ${isIntro ? "case-chapter--intro" : ""} ${isResults ? "case-chapter--results" : ""} ${isSummary ? "case-chapter--summary" : ""} ${isValidation ? "case-chapter--validation" : ""} ${isDetail || isValidation ? "case-chapter--continuation" : ""}`} key={index} id={isResultsDetails ? "results-details" : `section-${index}`}>
        <header className="case-chapter-heading" data-reveal>
          {caption && <span className={`chapter-index eyebrow${isResultDetail ? " chapter-index--goal" : ""}`}>{caption}</span>}
          {renderNode({ ...group.heading, text: isDetail ? capitalizeFirst(title.replace(/^Частный кейс:\s*/i, "")) : title.replace(/^\d+\.\s*/, "") }, `heading-${index}`)}
        </header>
        {renderBody(group.body, index)}
      </section>;
    })}
  </div>;
}

/** Mid-length case narratives keep the original section media and Figma links. */
export function CaseEditorialRenderer({source,content}:{source:string;content:import('./case-editorial-content').EditorialCase}){
 const raw=source.match(/<content>\n([\s\S]*?)\n<\/content>/)?.[1]||'';
 const [nodes]=parseSequence(raw.split('\n'),0);
 // Shared facts come from the detailed case, preserving its wording and units.
 const metadata=new Map<string,string>();
 for(const column of nodes.filter(n=>n.type==='columns').flatMap(n=>n.children||[])){
  let label='';
  for(const node of column.children||[]){
   if(node.type==='heading')label=(node.text||'').replace(/\*\*/g,'');
   else if(node.type==='paragraph'&&label&&!metadata.has(label))metadata.set(label,(node.text||'').replace(/\*\*|<br\s*\/?>/g,'').trim());
  }
 }
 const secondaryFact=metadata.has('Срок')?'Срок':'Фокус кейса';
 const facts=['Моя роль',secondaryFact].flatMap(label=>{
  const value=metadata.get(label);
  return value?[{label,value:label==='Моя роль'?value.split(/\s+[–—]\s+/)[0]:value}]:[];
 });
 const groups:{title:string;body:BlockNode[]}[]=[];
 for(const node of nodes){
  if(node.type==='heading'&&(node.level===1||node.level===2))groups.push({title:(node.text||'').replace(/\*\*/g,''),body:[]});
  else if(groups.length)groups[groups.length-1].body.push(node);
 }
 return <div className="notion-renderer case-editorial">
  <section className="editorial-overview" aria-label="О проекте">
   <dl className="editorial-facts">{facts.map(fact=><div key={fact.label}><dt>{typograph(fact.label)}</dt><dd>{typograph(fact.value)}</dd></div>)}</dl>
   <div className="editorial-context"><h2>Контекст и задача</h2><p>{typograph(content.context)}</p></div>
   <div className="editorial-contribution"><h2>Мой вклад</h2><p>{typograph(content.contribution)}</p></div>
  </section>
  {content.results.length > 0 && <section className="editorial-results" aria-label="Результат">
   {content.results.map((r,i)=><div className="editorial-result" key={i}><p className="editorial-result-value">{typograph(r.value)}</p><h2>{typograph(r.label)}</h2><p className="editorial-result-note">{typograph(r.note)}</p></div>)}
  </section>}
  {groups.filter(g=>content.sections[g.title]).map((group,i)=><section className="case-chapter editorial-section" key={group.title}>
   <header className="case-chapter-heading"><h2 className="notion-heading">{typograph(group.title.replace(/^\d+\.\s*/,'').replace(/^Частный кейс:\s*/,'').replace(/^./,c=>c.toUpperCase()))}</h2></header>
   <div className="editorial-section-copy">{content.sections[group.title].map((paragraph,j)=><p key={j}>{typograph(paragraph)}</p>)}</div>
   {group.body.filter(n=>n.type==='image'||n.type==='embed').map((n,j)=>renderNode(n,`editorial-media-${i}-${j}`))}
  </section>)}
  <section className="editorial-conclusion"><h2>Результат</h2><div>{content.conclusion.map((paragraph,i)=><p key={i}>{typograph(paragraph)}</p>)}</div></section>
 </div>;
}

/** Short mode preserves each original section’s project media. */
export function CaseTldrRenderer({source,content}:{source:string;content:import('./case-tldr-content').CaseTldrContent}){
 const raw=source.match(/<content>\n([\s\S]*?)\n<\/content>/)?.[1]||'';
 const [nodes]=parseSequence(raw.split('\n'),0);
 // Shared facts come from the detailed case, preserving its wording and units.
 const metadata=new Map<string,string>();
 for(const column of nodes.filter(n=>n.type==='columns').flatMap(n=>n.children||[])){
  let label='';
  for(const node of column.children||[]){
   if(node.type==='heading')label=(node.text||'').replace(/\*\*/g,'');
   else if(node.type==='paragraph'&&label&&!metadata.has(label))metadata.set(label,(node.text||'').replace(/\*\*|<br\s*\/?>/g,'').trim());
  }
 }
 const secondaryFact=metadata.has('Срок')?'Срок':'Фокус кейса';
 const facts=['Моя роль',secondaryFact].flatMap(label=>{
  const value=metadata.get(label);
  return value?[{label,value:label==='Моя роль'?value.split(/\s+[–—]\s+/)[0]:value}]:[];
 });
 const groups:{title:string;body:BlockNode[]}[]=[];
 for(const node of nodes){
  if(node.type==='heading'&&(node.level===1||node.level===2))groups.push({title:(node.text||'').replace(/\*\*/g,''),body:[]});
  else if(groups.length)groups[groups.length-1].body.push(node);
 }
 return <div className="notion-renderer case-tldr">
  <section className="tldr-overview" aria-label="О проекте">
   <div className="tldr-facts">{facts.map(fact=><div key={fact.label}><h2 className="eyebrow">{typograph(fact.label)}</h2><p>{typograph(fact.value)}</p></div>)}</div>
   <div className="tldr-context"><h2>Контекст и задача</h2><p>{typograph(content.context)}</p></div>
   <div className="tldr-contribution"><h2>Мой вклад</h2><p>{typograph(content.contribution)}</p></div>
  </section>
  {content.results.length > 0 && <section className="tldr-results" aria-label="Результат">
   {content.results.map((r,i)=><div className="tldr-result" key={i}><p className={`tldr-result-value${/^[\d≈]/.test(r.value)?"":" tldr-result-value--text"}`}>{typograph(r.value)}</p><h2>{typograph(r.label)}</h2><p className="tldr-result-note">{typograph(r.note)}</p></div>)}
  </section>}
  {groups.filter(g=>content.sections[g.title]).map((group,i)=><section className="case-chapter tldr-section" key={group.title}>
   <header className="case-chapter-heading"><h2 className="notion-heading">{typograph(group.title.replace(/^\d+\.\s*/,'').replace(/^Частный кейс:\s*/,'').replace(/^./,c=>c.toUpperCase()))}</h2></header>
   <p className="tldr-section-copy">{typograph(content.sections[group.title])}</p>
   {group.body.filter(n=>n.type==='image'||n.type==='embed').map((n,j)=>renderNode(n,`tldr-media-${i}-${j}`))}
  </section>)}
  <section className="tldr-conclusion"><h2>Результат</h2><p>{typograph(content.conclusion)}</p></section>
 </div>;
}
