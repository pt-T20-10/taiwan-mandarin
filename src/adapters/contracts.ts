import type {AppState,Content,LearningEvent,Mutation,AIReply,ChatTurn} from '../core/types';
export interface Storage {load():Promise<AppState>;put(mutation:Mutation):Promise<{version:number}>;event(event:LearningEvent,mutation?:Mutation):Promise<unknown>;}
export interface ContentStore {load():Promise<Content>;install(packageData:unknown):Promise<unknown>;}
export interface SpeechRecognition {transcribe(wav:Blob,signal?:AbortSignal):Promise<{text:string;elapsed_ms:number;notice:string}>;}
export interface SpeechSynthesis {speak(text:string):Promise<void>;stop():void;}
export interface ChatModel {reply(turns:ChatTurn[],id:string,mode:'chat'|'feedback'):Promise<AIReply>;cancel(id:string):Promise<unknown>;}
export interface Sync {available:boolean;sync():Promise<void>;}
