import { useState } from 'react';

import { CandidateTable } from './components/candidate-table';
import { RecordsTable } from './components/records-table';
import { ThemeToggle } from './components/theme/theme-toggle';
import { Autocomplete } from './components/ui/autocomplete';
import { ScrollArea, ScrollBar } from './components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { useRecords } from './contexts/records';
import { Record } from './data/records';
import { specialties, Specialty } from './data/specialties';

export function App() {
  const [selectedMode, setSelectedMode] = useState('specialty');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const { getAllNames } = useRecords();

  function handleSpecialtyClick(record: Record) {
    setSelectedName(record.name);
    setSelectedMode('name');
  }

  function handleNameClick(record: Record) {
    setSelectedSpecialty({
      id: record.specialtyId,
      name: record.specialtyName,
    });
    setSelectedMode('specialty');
  }

  return (
    <Tabs
      className="mx-auto flex max-w-6xl flex-col md:gap-4 md:p-4"
      value={selectedMode}
      onValueChange={setSelectedMode}
    >
      <header className="border-border bg-background px-3 dark:bg-muted md:rounded-md md:border">
        <div className="flex h-16 flex-1 items-center justify-between gap-4">
          <div className="flex flex-1 gap-3">
            <TabsList className="w-full sm:w-fit">
              <TabsTrigger value="specialty" className="w-full">
                Especialidade
              </TabsTrigger>
              <TabsTrigger value="name" className="w-full">
                Nome
              </TabsTrigger>
            </TabsList>

            <div className="hidden flex-1 sm:block">
              {selectedMode === 'specialty' && (
                <Autocomplete
                  value={selectedSpecialty}
                  onChange={setSelectedSpecialty}
                  options={specialties}
                  displayValue={(specialty) => specialty?.name ?? ''}
                  placeholder="Buscar por especialidade..."
                />
              )}

              {selectedMode === 'name' && (
                <Autocomplete
                  value={selectedName}
                  onChange={setSelectedName}
                  options={getAllNames()}
                  displayValue={(name) => name ?? ''}
                  placeholder="Buscar por nome..."
                />
              )}
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="pb-4 sm:hidden">
          {selectedMode === 'specialty' && (
            <Autocomplete
              value={selectedSpecialty}
              onChange={setSelectedSpecialty}
              options={specialties}
              displayValue={(specialty) => specialty?.name ?? ''}
              placeholder="Buscar por especialidade..."
            />
          )}

          {selectedMode === 'name' && (
            <Autocomplete
              value={selectedName}
              onChange={setSelectedName}
              options={getAllNames()}
              displayValue={(name) => name ?? ''}
              placeholder="Buscar por nome..."
            />
          )}
        </div>
      </header>

      <main>
        <ScrollArea className="h-[calc(100svh-7.5rem)] w-full border border-border bg-background dark:bg-muted md:h-[calc(100vh-7.15rem)] md:rounded-md">
          <ScrollBar orientation="horizontal" />
          <TabsContent value="specialty">
            {!!selectedSpecialty && (
              <RecordsTable specialty={selectedSpecialty.id} onRecordClick={handleSpecialtyClick} />
            )}
          </TabsContent>
          <TabsContent value="name">
            {!!selectedName && (
              <CandidateTable name={selectedName} onRecordClick={handleNameClick} />
            )}
          </TabsContent>
        </ScrollArea>
      </main>
    </Tabs>
  );
}
