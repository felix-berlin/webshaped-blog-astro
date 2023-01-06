import { atom, onMount } from 'nanostores';

export type LoadingStateValue = 'empty' | 'loading' | 'loaded';
export const loadingState = atom<LoadingStateValue>('empty');

export type WebmentionsCount = number;
export const currentWebmentionsCount = atom<WebmentionsCount>(0);

export type darkMode = boolean;
export const isDarkMode = atom<darkMode>(false);

onMount(isDarkMode, () => {
  const checkColorMode = localStorage.getItem('darkMode') === 'true' ? true : false;
  isDarkMode.set(checkColorMode);
});
