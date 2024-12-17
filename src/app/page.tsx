import { RecordsRepository } from '@/data/records';

export default async function Home() {
  const start = new Date();
  const repository = await RecordsRepository.load();
  const recordCount = repository.getRecordsCount();
  const end = new Date();
  const duration = end.getTime() - start.getTime();

  return (
    <div className="flex h-screen items-center justify-center">
      <p>
        {recordCount} records loaded in {duration}ms
      </p>
    </div>
  );
}
