export const studyIds = ['01','02','03','04','05','06','07','08','09','10','11'] as const;
export type StudyId = typeof studyIds[number];
export function isStudyId(value:string):value is StudyId { return studyIds.includes(value as StudyId); }
export const studyNames:Record<StudyId,string> = {'01':'Edge','02':'Signature','03':'Instrument','04':'Orbit','05':'Modules','06':'Field','07':'Workbench','08':'Signal','09':'Workbench / Clean','10':'Workbench / Typography','11':'Workbench / TLDR'};
