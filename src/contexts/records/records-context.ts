import { createContext } from 'react';

import type { Record } from '@/data/records';

export interface RecordsContextValue {
  findBySpecialty: (specialty: string) => Record[];
  findByName: (name: string) => Record[];
  getAllNames: () => string[];
  getRecordsCount: () => number;
}

export const RecordsContext = createContext<RecordsContextValue>({
  findBySpecialty: () => [],
  findByName: () => [],
  getAllNames: () => [],
  getRecordsCount: () => 0,
});
