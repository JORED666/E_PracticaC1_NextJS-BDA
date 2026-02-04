import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { query } from '@/lib/db';
import { MostBorrowedBook } from '@/types';

export default async function MostBorrowedPage() {
  let books: MostBorrowedBook[] = [];
  let error = null;

  try {
    const result = await query('SELECT * FROM vw_most_borrowed_books LIMIT 20');
    books = result.rows;
  } catch (err) {
    error = 'Error al cargar los datos';
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            📖 Libros más prestados
          </h1>
          <p className="text-gray-600 mt-2">
            Ranking de popularidad de libros en la biblioteca
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Préstamos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actualmente Prestados
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.book_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-2xl font-bold text-gray-900">
                      #{book.popularity_rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {book.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{book.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.total_loans}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.currently_loaned}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {books.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
