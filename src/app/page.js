'use client';
import Link from 'next/link';

export default function EditorPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to Astrikos</h1>

      <Link href="/3dHomePage">
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          View 3D City
        </button>
      </Link>
    </div>
  )
}