import { type ReactNode, useRef } from 'react';

import { RecordsRepository } from '@/data/records';

import { RecordsContext } from './records-context';

interface RecordsProviderProps {
  children: ReactNode;
}

export function RecordsProvider({ children }: RecordsProviderProps) {
  const repository = useRef(new RecordsRepository());

  return (
    <RecordsContext.Provider
      value={{
        findBySpecialty: (specialty) => repository.current.findBySpecialty(specialty) ?? [],
        findByName: (name) => repository.current.findByName(name) ?? [],
        getAllNames: () => repository.current.getAllNames() ?? [],
        getRecordsCount: () => repository.current.getRecordsCount() ?? 0,
      }}
    >
      {children}
    </RecordsContext.Provider>
  );
}
