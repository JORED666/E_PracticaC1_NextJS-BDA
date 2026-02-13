'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  paramName?: string;
}

export function SearchInput({ placeholder = 'Buscar...', paramName = 'search' }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get(paramName) || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm) {
      params.set(paramName, searchTerm);
      params.set('page', '1'); // Reset to page 1
    } else {
      params.delete(paramName);
    }
    
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Buscar
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              const params = new URLSearchParams(searchParams);
              params.delete(paramName);
              params.set('page', '1');
              router.push(`?${params.toString()}`);
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Limpiar
          </button>
        )}
      </div>
    </form>
  );
}
