import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRecords } from '@/contexts/records';
import { Record } from '@/data/records';

import { Button } from './ui/button';

interface RecordsTableProps {
  specialty: string;
  onRecordClick: (record: Record) => void;
}

export function RecordsTable({ specialty, onRecordClick }: RecordsTableProps) {
  const { findBySpecialty } = useRecords();
  const records = findBySpecialty(specialty);

  return (
    <Table className="-mt-2">
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className="whitespace-nowrap text-right">Nota</TableHead>
          <TableHead className="whitespace-nowrap text-right">Nota Final</TableHead>
          <TableHead className="pr-6 text-right">Ranking</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.name}>
            <TableCell>
              <Button variant="link" className="h-min p-0" onClick={() => onRecordClick(record)}>
                {record.name}
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
