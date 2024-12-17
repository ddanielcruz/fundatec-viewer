import { readFile } from 'node:fs/promises';

export type Record = {
  name: string;
  specialty: string;
  examScore: number;
  finalScore: number;
  governmentProgram: boolean;
  ranking: number;
};

export class RecordsRepository {
  private records: Record[] = [];
  private specialtyIndex: Map<string, Record[]> = new Map();
  private nameIndex: Map<string, Record[]> = new Map();

  static async load(): Promise<RecordsRepository> {
    const instance = new RecordsRepository();
    await instance.loadFromCSV();
    return instance;
  }

  private async loadFromCSV() {
    try {
      const content = await readFile('data/records.csv', 'utf-8');
      const lines = content.split('\n');

      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const [specialty, name, examScore, governmentProgram, finalScore, ranking] =
          line.split(';');

        const record: Record = {
          specialty,
          name,
          examScore: parseFloat(examScore.replace(',', '.')),
          governmentProgram: governmentProgram === 'Sim',
          finalScore: parseFloat(finalScore.replace(',', '.')),
          ranking: parseInt(ranking, 10),
        };

        this.records.push(record);

        // Index by specialty
        const specialtyRecords = this.specialtyIndex.get(specialty) || [];
        specialtyRecords.push(record);
        this.specialtyIndex.set(specialty, specialtyRecords);

        // Index by name
        const nameRecords = this.nameIndex.get(name) || [];
        nameRecords.push(record);
        this.nameIndex.set(name, nameRecords);
      }

      console.log(`Loaded ${this.records.length} records with indexes`);
    } catch (error) {
      console.error('Error loading records:', error);
      throw error;
    }
  }

  findBySpecialty(specialty: string): Record[] {
    return this.specialtyIndex.get(specialty) || [];
  }

  findByName(name: string): Record[] {
    // Case insensitive partial match
    const searchTerm = name.toLowerCase();
    const results: Record[] = [];

    for (const [recordName, records] of this.nameIndex.entries()) {
      if (recordName.toLowerCase().includes(searchTerm)) {
        results.push(...records);
      }
    }

    return results;
  }

  getAllSpecialties(): string[] {
    return Array.from(this.specialtyIndex.keys()).sort();
  }

  getRecordsCount(): number {
    return this.records.length;
  }
}
