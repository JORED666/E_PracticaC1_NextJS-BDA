'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  onFilter?: () => void;
}

export function DateRangeFilter({ onFilter }: DateRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [fromDate, setFromDate] = useState(searchParams.get('fromDate') || '');
  const [toDate, setToDate] = useState(searchParams.get('toDate') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    params.set('page', '1');
    
    if (fromDate) {
      params.set('fromDate', fromDate);
    } else {
      params.delete('fromDate');
    }
    
    if (toDate) {
      params.set('toDate', toDate);
    } else {
      params.delete('toDate');
    }
    
    router.push(`?${params.toString()}`);
    onFilter?.();
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('fromDate');
    params.delete('toDate');
    params.set('page', '1');
    
    setFromDate('');
    setToDate('');
    
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleFilter} className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <label className="text-sm font-medium text-gray-700">Desde:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Hasta:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Filtrar
        </button>

        {(fromDate || toDate) && (
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
