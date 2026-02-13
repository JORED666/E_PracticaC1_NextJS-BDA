'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface CategoryFilterProps {
  categories: string[];
  onFilter?: () => void;
}

export function CategoryFilter({ categories, onFilter }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    params.set('page', '1');
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    
    router.push(`?${params.toString()}`);
    onFilter?.();
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.set('page', '1');
    
    setSelectedCategory('');
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleFilter} className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm font-medium text-gray-700">
          Categoría:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Filtrar
        </button>

        {selectedCategory && (
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
