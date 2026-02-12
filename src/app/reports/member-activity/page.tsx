import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { query } from '@/lib/db';
import { MemberActivity, SearchParams, PaginatedResult } from '@/types';
import { SearchInput } from '@/components/SearchInput';
import { Pagination } from '@/components/Pagination';

const PAGE_SIZE = 15;

async function getMemberActivity(params: SearchParams): Promise<PaginatedResult<MemberActivity>> {
  const page = Math.max(1, parseInt(params.page?.toString() || '1'));
  const search = params.search?.toString().trim() || '';
  const offset = (page - 1) * PAGE_SIZE;

  let whereClause = '';
  let countQuery = 'SELECT COUNT(*) FROM vw_member_activity';

  if (search) {
    whereClause = ` WHERE LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1)`;
    countQuery += whereClause;
  }

  try {
    const countResult = await query(countQuery, search ? [`%${search}%`] : []);
    const total = parseInt(countResult.rows[0].count) || 0;
    const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

    const dataQuery = `SELECT * FROM vw_member_activity${whereClause} ORDER BY total_loans DESC LIMIT $${search ? 2 : 1} OFFSET $${search ? 3 : 2}`;
    const params_array = search ? [`%${search}%`, PAGE_SIZE, offset] : [PAGE_SIZE, offset];
    
    const result = await query(dataQuery, params_array);

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

export default async function MemberActivityPage({ searchParams }: Props) {
  const params = await searchParams;
  const result = await getMemberActivity(params);
  const { data: members, total, page, totalPages } = result;
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
            👥 Actividad de socios
          </h1>
          <p className="text-gray-600 mt-2">
            Estadísticas de préstamos y multas por usuario
          </p>
        </div>

        {/* Search */}
        <SearchInput placeholder="Buscar por nombre o email..." paramName="search" />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Results Info */}
        {!error && total > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Se encontraron <span className="font-semibold">{total}</span> socio(s)
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
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Préstamos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vencidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Multas Pendientes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.member_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {member.member_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.total_loans}
                    <span className="text-gray-500 text-xs ml-1">
                      ({member.active_loans} activos)
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.overdue_loans > 0 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {member.overdue_loans}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${Number(member.pending_fines).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.status_category === 'Excelente' ? 'bg-green-100 text-green-800' :
                      member.status_category === 'Bueno' ? 'bg-blue-100 text-blue-800' :
                      member.status_category === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {member.status_category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {members.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              No hay datos de actividad
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
      </div>
    </div>
  );
}
