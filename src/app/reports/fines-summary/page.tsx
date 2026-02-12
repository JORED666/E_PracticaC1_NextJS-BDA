import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { query } from '@/lib/db';
import { FinesSummary, SearchParams, PaginatedResult } from '@/types';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { Pagination } from '@/components/Pagination';

const PAGE_SIZE = 10;

async function getFinesSummary(params: SearchParams): Promise<PaginatedResult<FinesSummary>> {
  const page = Math.max(1, parseInt(params.page?.toString() || '1'));
  const fromDate = params.fromDate?.toString() || '';
  const toDate = params.toDate?.toString() || '';
  const offset = (page - 1) * PAGE_SIZE;

  let whereClause = '';
  const queryParams: (string | number)[] = [];

  if (fromDate) {
    whereClause += `month >= $1`;
    queryParams.push(`${fromDate}-01`);
  }

  if (toDate) {
    const nextMonth = new Date(toDate + '-01');
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = nextMonth.toISOString().split('T')[0];
    whereClause += (whereClause ? ' AND ' : '') + `month < $${queryParams.length + 1}`;
    queryParams.push(nextMonthStr);
  }

  try {
    const countQuery = `SELECT COUNT(*) as count FROM vw_fines_summary ${whereClause ? 'WHERE ' + whereClause : ''}`;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count) || 0;
    const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

    const dataQuery = `SELECT * FROM vw_fines_summary ${whereClause ? 'WHERE ' + whereClause : ''} ORDER BY month DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(PAGE_SIZE, offset);
    
    const result = await query(dataQuery, queryParams);

    return {
      data: result.rows,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages,
    };
  } catch (err) {
    console.error('Database error:', err);
    return {
      data: [],
      total: 0,
      page,
      pageSize: PAGE_SIZE,
      totalPages: 1,
    };
  }
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function FinesSummaryPage({ searchParams }: Props) {
  const params = await searchParams;
  const result = await getFinesSummary(params);
  const { data: fines, total, page, totalPages } = result;
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
            💰 Resumen de multas
          </h1>
          <p className="text-gray-600 mt-2">
            Análisis mensual de multas pagadas y pendientes
          </p>
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Results Info */}
        {!error && total > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Se encontraron <span className="font-semibold">{total}</span> mes(es) con multas
          </p>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Multas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Monto Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pagado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pendiente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tasa de Pago
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fines.map((fine, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fine.month_label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fine.total_fines} ({fine.paid_count} pagadas, {fine.pending_count} pendientes)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${Number(fine.total_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    ${Number(fine.paid_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    ${Number(fine.pending_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      Number(fine.payment_rate_percentage) >= 70 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {Number(fine.payment_rate_percentage).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {fines.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              No hay datos de multas
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
      </div>
    </div>
  );
}
