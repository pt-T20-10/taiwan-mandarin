import type {Content} from './types';
export const lessonRoute=(id:string)=>'learn/'+encodeURIComponent(id);
export function orderedLessons(content:Content){return content.units.flatMap(unit=>unit.lessons.map(lesson=>({unit,lesson})));}
export function lessonAt(content:Content,route:string){return orderedLessons(content).find(x=>lessonRoute(x.lesson.id)===route);}
export function followingLesson(content:Content,id:string){const all=orderedLessons(content);const index=all.findIndex(x=>x.lesson.id===id);return index<0?undefined:all[index+1];}
