import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export const selectedPriceAtom = atomWithReset(0);
