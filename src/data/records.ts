import recordsData from './records.json';
import { specialties } from './specialties';

export type Record = {
  name: string;
  specialtyId: string;
  specialtyName: string;
  examScore: number;
  finalScore: number;
  governmentProgram: boolean;
  ranking: number;
};

type RecordJSON = {
  specialty: string;
  name: string;
  notaTO: number;
  programaGoverno: boolean;
  notaFinal: number;
  ranking: number;
};

export class RecordsRepository {
  private records: Record[] = [];
  private specialtyIndex: Map<string, Record[]> = new Map();
  private nameIndex: Map<string, Record[]> = new Map();
  private names: string[] = [];

  constructor() {
    const specialtiesMap = new Map<string, string>();
    for (const specialty of specialties) {
      specialtiesMap.set(specialty.id, specialty.name);
    }

    for (const recordJson of recordsData as RecordJSON[]) {
      const record: Record = {
        name: recordJson.name,
        specialtyId: recordJson.specialty,
        specialtyName: specialtiesMap.get(recordJson.specialty) || '',
        examScore: recordJson.notaTO,
        finalScore: recordJson.notaFinal,
        governmentProgram: recordJson.programaGoverno,
        ranking: recordJson.ranking,
      };

      this.records.push(record);
      this.specialtyIndex.set(record.specialtyId, [
        ...(this.specialtyIndex.get(record.specialtyId) || []),
        record,
      ]);
      this.nameIndex.set(record.name, [...(this.nameIndex.get(record.name) || []), record]);

      if (!this.names.includes(record.name)) {
        this.names.push(record.name);
      }
    }

    this.names.sort();
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

  getAllNames(): string[] {
    return this.names;
  }

  getRecordsCount(): number {
    return this.records.length;
  }
}
