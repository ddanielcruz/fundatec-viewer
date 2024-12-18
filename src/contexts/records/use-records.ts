import { useContext } from 'react';

import { RecordsContext } from './records-context';

export function useRecords() {
  const context = useContext(RecordsContext);

  if (!context) {
    throw new Error('useRecords must be used within a RecordsProvider');
  }

  return context;
}
