import { useMemo, useState } from 'react';

import { ThemeToggle } from './components/theme/theme-toggle';
import { Autocomplete } from './components/ui/autocomplete';
import { Button } from './components/ui/button';
import { ScrollArea, ScrollBar } from './components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { useRecords } from './contexts/records';
import { Record } from './data/records';
import { specialties, Specialty } from './data/specialties';

export function App() {
  const [selectedMode, setSelectedMode] = useState('specialty');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const { findBySpecialty, getAllNames } = useRecords();

  const nameOptions = useMemo(() => {
    return getAllNames();
  }, [getAllNames]);

  const filteredRecords = selectedSpecialty ? findBySpecialty(selectedSpecialty.id) : [];

  function handleRecordClick(record: Record) {
    console.log(record);
  }

  const TableContent = () => (
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
        {filteredRecords.map((record) => (
          <TableRow key={record.name}>
            <TableCell>
              <Button
                variant="link"
                className="h-min p-0"
                onClick={() => handleRecordClick(record)}
              >
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

  return (
    <Tabs
      className="mx-auto flex max-w-6xl flex-col md:gap-4 md:p-4"
      value={selectedMode}
      onValueChange={setSelectedMode}
    >
      <header className="flex h-16 items-center justify-between gap-4 border-border px-3 md:rounded-md md:border">
        <div className="flex flex-1 gap-3">
          <TabsList>
            <TabsTrigger value="specialty">Especialidade</TabsTrigger>
            <TabsTrigger value="name">Nome</TabsTrigger>
          </TabsList>

          {selectedMode === 'specialty' && (
            <div className="max-w-md flex-1">
              <Autocomplete
                value={selectedSpecialty}
                onChange={setSelectedSpecialty}
                options={specialties}
                displayValue={(specialty) => specialty?.name ?? ''}
                placeholder="Buscar por especialidade..."
              />
            </div>
          )}

          {selectedMode === 'name' && (
            <div className="max-w-md flex-1">
              <Autocomplete
                value={selectedName}
                onChange={setSelectedName}
                options={nameOptions}
                displayValue={(name) => name ?? ''}
                placeholder="Buscar por nome..."
              />
            </div>
          )}
        </div>
        <ThemeToggle />
      </header>

      <main>
        <ScrollArea className="h-[calc(100svh-4rem)] w-full border border-border md:h-[calc(100svh-8.5rem)] md:rounded-md">
          <ScrollBar orientation="horizontal" />
          <TabsContent value="specialty">
            <TableContent />
          </TabsContent>
          <TabsContent value="name">
            <TableContent />
          </TabsContent>
        </ScrollArea>
      </main>
    </Tabs>
  );
}
