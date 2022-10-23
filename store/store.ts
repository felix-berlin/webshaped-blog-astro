import { atom } from 'nanostores';

export type LoadingStateValue = 'empty' | 'loading' | 'loaded';
export const loadingState = atom<LoadingStateValue>('empty');

export type WebmentionsCount = number;
export const currentWebmentionsCount = atom<WebmentionsCount>(0);
