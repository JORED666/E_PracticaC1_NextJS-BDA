'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface MinDaysFilterProps {
  onFilter?: () => void;
}

export function MinDaysFilter({ onFilter }: MinDaysFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [minDays, setMinDays] = useState(searchParams.get('minDays') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    params.set('page', '1');
    
    if (minDays) {
      params.set('minDays', minDays);
    } else {
      params.delete('minDays');
    }
    
    router.push(`?${params.toString()}`);
    onFilter?.();
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('minDays');
    params.set('page', '1');
    
    setMinDays('');
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleFilter} className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm font-medium text-gray-700">
          Mínimo de días de atraso:
        </label>
        <input
          type="number"
          min="0"
          value={minDays}
          onChange={(e) => setMinDays(e.target.value)}
          placeholder="Ej: 7"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
        />

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Filtrar
        </button>

        {minDays && (
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm font-medium"
          >
            Limpiar
          </button>
        )}
      </div>
    </form>
  );
}
