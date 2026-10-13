import type { ProjectSlug } from "./project-art";
import type { StudyId } from "./study-config";
import { StudyCover } from "./study-covers";
import { MixCover } from "./mix-covers";
import { VisualCaseCover } from "./visual-case-cover";
export function ProjectCover({slug,priority=false,variant='01'}:{slug:ProjectSlug;priority?:boolean;variant?:StudyId}){
 if(variant==='11')return <div className="project-cover generated-project-cover"><VisualCaseCover slug={slug} priority={priority}/></div>;
 const coverVariant=(variant==='09'||variant==='10')?'07':variant;
 return <div className={`project-cover studio-cover shot-cover shot-cover--${slug} study-cover study-cover-${coverVariant}`} data-priority={priority||undefined}>{Number(coverVariant)>5?<MixCover slug={slug} variant={coverVariant}/>:<StudyCover slug={slug} variant={coverVariant}/>}</div>;
}
