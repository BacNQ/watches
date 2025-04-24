import { atom } from 'jotai';

export function checkIsLoggedIn() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return !!token;
  }
}

export const authorizationAtom = atom(checkIsLoggedIn());
