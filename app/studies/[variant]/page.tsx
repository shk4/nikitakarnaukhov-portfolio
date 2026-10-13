import { HomeView } from '../../page';
import { isStudyId, studyIds } from '../../study-config';
import { notFound } from 'next/navigation';
export function generateStaticParams() { return studyIds.map(variant => ({variant})); }
export default async function StudyPage({params}:{params:Promise<{variant:string}>}) {
 const {variant}=await params;if(!isStudyId(variant))notFound();
 return <HomeView variant={variant}/>;
}
