import {createContext,useContext} from 'react';
import type {AppState,Content,Layers,LearningEvent,Mutation} from './core/types';
export type AppContextValue={state:AppState;content:Content;layers:Layers;refresh:()=>Promise<void>;put:(m:Mutation)=>Promise<void>;event:(e:LearningEvent,m?:Mutation)=>Promise<void>;notify:(s:string)=>void};
export const AppContext=createContext<AppContextValue>(null!);
export const useApp=()=>useContext(AppContext);
