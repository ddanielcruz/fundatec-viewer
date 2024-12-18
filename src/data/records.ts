import recordsData from './records.json';

export type Record = {
  name: string;
  specialty: string;
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

  constructor() {
    for (const recordJson of recordsData as RecordJSON[]) {
      const record: Record = {
        name: recordJson.name,
        specialty: recordJson.specialty,
        examScore: recordJson.notaTO,
        finalScore: recordJson.notaFinal,
        governmentProgram: recordJson.programaGoverno,
        ranking: recordJson.ranking,
      };

      this.records.push(record);
      this.specialtyIndex.set(record.specialty, [
        ...(this.specialtyIndex.get(record.specialty) || []),
        record,
      ]);
      this.nameIndex.set(record.name, [...(this.nameIndex.get(record.name) || []), record]);
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

  getAllNames(): string[] {
    return Array.from(this.nameIndex.keys()).sort();
  }

  getRecordsCount(): number {
    return this.records.length;
  }
}
