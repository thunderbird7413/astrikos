'use client';
import { useRouter } from 'next/navigation';

export default function DoneButton() {
  const router = useRouter();
  return (
    <button
      className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      onClick={() => router.push('/')}
    >
      Done
    </button>
  );
}
