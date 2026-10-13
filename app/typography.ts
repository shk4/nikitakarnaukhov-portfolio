const NBSP = "\u00a0";
const shortWords = /(?<![\p{L}\p{N}_])(?:из-за|из-под|без|для|при|над|под|про|как|что|это|или|от|до|из|на|по|за|со|во|ко|об|не|ни|но|да|то|в|к|с|у|о|а|и|я) +(?=[«„(\[\p{L}\p{N}*])/giu;

/** Deterministic Russian typography. URLs, code and markup stay byte-for-byte intact. */
export function typograph(source: string): string {
  return source.split(/(https?:\/\/[^\s<>]+|`[^`]*`|<[^>]*>)/g).map((part, index) => {
    if (index % 2) return part;
    let text = part
      .replace(/ {2,}/g, " ")
      .replace(/ +([,.;:!?])/g, "$1")
      .replace(/\.\.\./g, "…")
      .replace(/"([^"\n]+)"/g, "«$1»")
      .replace(/ +[-—–] +/g, `${NBSP}– `)
      .replace(/(\d) *(%|₽|€|\$|px|кг|мс|МБ|ГБ)(?!\p{L})/gu, `$1${NBSP}$2`)
      .replace(/(\d) +(лет|год|года|месяц|месяца|месяцев|дня|дней|раз|раза|пункта|пунктов)(?!\p{L})/giu, `$1${NBSP}$2`)
      .replace(/(№) *(?=\d)/g, `$1${NBSP}`)
      .replace(/ +(?=(?:бы|же|ли)(?!\p{L}))/giu, NBSP);
    // Lookahead keeps adjacent short words in the same typographic group.
    text = text.replace(shortWords, word => word.trimEnd() + NBSP);
    return text;
  }).join("");
}
