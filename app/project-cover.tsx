import type { ProjectSlug } from "./project-art";
import { VisualCaseCover } from "./visual-case-cover";
export function ProjectCover({slug,priority=false}:{slug:ProjectSlug;priority?:boolean}) {
 return <div className="project-cover generated-project-cover"><VisualCaseCover slug={slug} priority={priority}/></div>;
}
