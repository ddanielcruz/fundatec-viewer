import { useState } from 'react';

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

  function handleRecordClick(record: Record) {
    setSelectedName(record.name);
    setSelectedMode('name');
  }

  return (
    <Tabs
      className="mx-auto flex max-w-6xl flex-col md:gap-4 md:p-4"
      value={selectedMode}
      onValueChange={setSelectedMode}
    >
      <header className="border-border px-3 md:rounded-md md:border">
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
        <ScrollArea className="h-[calc(100svh-7.5rem)] w-full border border-border md:h-[calc(100svh-8.5rem)] md:rounded-md">
          <ScrollBar orientation="horizontal" />
          <TabsContent value="specialty">
            {selectedSpecialty ? (
              <RecordsTable specialty={selectedSpecialty.id} onRecordClick={handleRecordClick} />
            ) : (
              <div className="flex h-[calc(100svh-5rem)] items-center justify-center md:h-[calc(100svh-9.5rem)]">
                <span className="text-center text-muted-foreground">
                  Selecione uma especialidade para ver os resultados.
                </span>
              </div>
            )}
          </TabsContent>
          <TabsContent value="name"></TabsContent>
        </ScrollArea>
      </main>
    </Tabs>
  );
}
