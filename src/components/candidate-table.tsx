import { useRecords } from '@/contexts/records';
import { Record } from '@/data/records';

import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface CandidateTableProps {
  name: string;
  onRecordClick: (record: Record) => void;
}

export function CandidateTable({ name, onRecordClick }: CandidateTableProps) {
  const { findByName } = useRecords();
  const records = findByName(name);

  // Sort records by ranking then name
  const sortedRecords = records.sort((a, b) => {
    if (a.ranking === b.ranking) {
      return a.name.localeCompare(b.name);
    }

    return a.ranking - b.ranking;
  });

  return (
    <Table className="-mt-2">
      <TableHeader>
        <TableRow>
          <TableHead>Especialidade</TableHead>
          <TableHead className="whitespace-nowrap text-right">Nota</TableHead>
          <TableHead className="whitespace-nowrap text-right">Nota Final</TableHead>
          <TableHead className="pr-6 text-right">Ranking</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRecords.map((record) => (
          <TableRow key={record.specialtyId}>
            <TableCell>
              <Button variant="link" className="h-min p-0" onClick={() => onRecordClick(record)}>
                {record.specialtyName}
              </Button>
            </TableCell>
            <TableCell className="text-right">{record.examScore.toFixed(2)}</TableCell>
            <TableCell className="text-right">{record.finalScore.toFixed(2)}</TableCell>
            <TableCell className="pr-6 text-right font-bold text-primary">
              {record.ranking}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
