import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getOverdueLoans } from '@/lib/reports';
import { SearchInput } from '@/components/SearchInput';
import { MinDaysFilter } from '@/components/MinDaysFilter';
import { Pagination } from '@/components/Pagination';

// Data fetching is handled by `getOverdueLoans` in `src/lib/reports.ts`.

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function OverdueLoansPage({ searchParams }: Props) {
  const params = await searchParams;
  const result = await getOverdueLoans(params);
  const { data: loans, total, page, totalPages } = result;
  const error = total === -1 ? 'Error al cargar datos' : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            ⏰ Préstamos vencidos
          </h1>
          <p className="text-gray-600 mt-2">
            Libros que no han sido devueltos a tiempo
          </p>
        </div>

        {/* Search */}
        <SearchInput placeholder="Buscar por socio, libro o código..." paramName="search" />

        {/* Filters */}
        <MinDaysFilter />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Results Info */}
        {!error && total > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Se encontraron <span className="font-semibold">{total}</span> préstamo(s) vencido(s)
          </p>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Socio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Libro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Días de Atraso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Multa Sugerida
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.loan_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {loan.member_name}
                    </div>
                    <div className="text-sm text-gray-500">{loan.member_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {loan.book_title}
                    </div>
                    <div className="text-sm text-gray-500">{loan.book_author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(loan.due_at).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {loan.days_overdue} días
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${Number(loan.suggested_fine_amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loans.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              No hay préstamos vencidos
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
      </div>
    </div>
  );
}
