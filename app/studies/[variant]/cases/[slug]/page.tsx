import CasePage,{generateMetadata as caseMetadata} from '../../../../cases/[slug]/page';
import { isStudyId } from '../../../../study-config';
import { portfolioCases } from '../../../../notion-content';
import { notFound } from 'next/navigation';
export function generateStaticParams() { return portfolioCases.map(item => ({slug:item.slug})); }
type Props={params:Promise<{variant:string;slug:string}>};
export const generateMetadata=caseMetadata;
export default async function StudyCase({params}:Props){
 const {variant,slug}=await params;if(!isStudyId(variant))notFound();
 return <CasePage params={Promise.resolve({slug})} variant={variant}/>;
}
