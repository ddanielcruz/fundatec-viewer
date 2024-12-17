'use client';

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={() => console.log('clicked')}>Click me</Button>
    </div>
  );
}
