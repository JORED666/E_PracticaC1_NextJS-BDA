import { query } from '@/lib/db';
import { FinesSummary, SearchParams, PaginatedResult, MostBorrowedBook, InventoryHealth, MemberActivity, OverdueLoan } from '@/types';

const PAGE_SIZE = 10;

export async function getFinesSummary(params: SearchParams): Promise<PaginatedResult<FinesSummary>> {
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
    console.error('Database error in getFinesSummary:', err);
    return {
      data: [],
      total: 0,
      page,
      pageSize: PAGE_SIZE,
      totalPages: 1,
    };
  }
}

export async function getMostBorrowedBooks(params: SearchParams): Promise<PaginatedResult<MostBorrowedBook>> {
  const page = Math.max(1, parseInt(params.page?.toString() || '1'));
  const search = params.search?.toString().trim() || '';
  const offset = (page - 1) * PAGE_SIZE;

  let whereClause = '';
  let countQuery = 'SELECT COUNT(*) FROM vw_most_borrowed_books';

  if (search) {
    whereClause = ` WHERE LOWER(title) LIKE LOWER($1) OR LOWER(author) LIKE LOWER($1)`;
    countQuery += whereClause;
  }

  try {
    const countResult = await query(countQuery, search ? [`%${search}%`] : []);
    const total = parseInt(countResult.rows[0].count) || 0;
    const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

    const dataQuery = `SELECT * FROM vw_most_borrowed_books${whereClause} ORDER BY popularity_rank LIMIT $${search ? 2 : 1} OFFSET $${search ? 3 : 2}`;
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
    console.error('Database error in getMostBorrowedBooks:', err);
    return {
      data: [],
      total: 0,
      page,
      pageSize: PAGE_SIZE,
      totalPages: 1,
    };
  }
}

export async function getInventoryHealth(params: SearchParams): Promise<PaginatedResult<InventoryHealth> & { categories: string[] }> {
  const PAGE = 5;
  const page = Math.max(1, parseInt(params.page?.toString() || '1'));
  const category = params.category?.toString().trim() || '';
  const offset = (page - 1) * PAGE;

  // Get all categories from the view
  let categoriesResult: string[] = [];
  try {
    const catQuery = 'SELECT DISTINCT category FROM vw_inventory_health ORDER BY category';
    const catRes = await query(catQuery, []);
    categoriesResult = catRes.rows.map((r: { category: string }) => r.category);
  } catch (err) {
    console.error('Error fetching categories in getInventoryHealth:', err);
  }

  let whereClause = '';
  let countQuery = 'SELECT COUNT(DISTINCT category) FROM vw_inventory_health';

  if (category) {
    whereClause = ` WHERE category = $1`;
    countQuery += whereClause;
  }

  try {
    const countResult = await query(countQuery, category ? [category] : []);
    const total = parseInt(countResult.rows[0].count) || 0;
    const totalPages = Math.ceil(total / PAGE) || 1;

    const dataQuery = `SELECT * FROM vw_inventory_health${whereClause} ORDER BY unique_books DESC LIMIT $${category ? 2 : 1} OFFSET $${category ? 3 : 2}`;
    const params_array = category ? [category, PAGE, offset] : [PAGE, offset];
    
    const result = await query(dataQuery, params_array);

    return {
      data: result.rows,
      total,
      page,
      pageSize: PAGE,
      totalPages,
      categories: categoriesResult,
    };
  } catch (err) {
    console.error('Database error in getInventoryHealth:', err);
    return {
      data: [],
      total: 0,
      page,
      pageSize: PAGE,
      totalPages: 1,
      categories: categoriesResult,
    };
  }
}

export async function getMemberActivity(params: SearchParams): Promise<PaginatedResult<MemberActivity>> {
  const PAGE = 15;
  const page = Math.max(1, parseInt(params.page?.toString() || '1'));
  const search = params.search?.toString().trim() || '';
  const offset = (page - 1) * PAGE;

  let whereClause = '';
  let countQuery = 'SELECT COUNT(*) FROM vw_member_activity';

  if (search) {
    whereClause = ` WHERE LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1)`;
    countQuery += whereClause;
  }

  try {
    const countResult = await query(countQuery, search ? [`%${search}%`] : []);
    const total = parseInt(countResult.rows[0].count) || 0;
    const totalPages = Math.ceil(total / PAGE) || 1;

    const dataQuery = `SELECT * FROM vw_member_activity${whereClause} ORDER BY total_loans DESC LIMIT $${search ? 2 : 1} OFFSET $${search ? 3 : 2}`;
    const params_array = search ? [`%${search}%`, PAGE, offset] : [PAGE, offset];
    
    const result = await query(dataQuery, params_array);

    return {
      data: result.rows,
      total,
      page,
      pageSize: PAGE,
      totalPages,
    };
  } catch (err) {
    console.error('Database error in getMemberActivity:', err);
    return {
      data: [],
      total: 0,
      page,
      pageSize: PAGE,
      totalPages: 1,
    };
  }
}

export async function getOverdueLoans(params: SearchParams): Promise<PaginatedResult<OverdueLoan>> {
  const PAGE = 10;
  const page = Math.max(1, parseInt(params.page?.toString() || '1'));
  const search = params.search?.toString().trim() || '';
  const minDays = params.minDays ? parseInt(params.minDays.toString()) : null;
  const offset = (page - 1) * PAGE;

  let whereClause = '';
  const queryParams: (string | number)[] = [];
  let paramCount = 1;

  if (search) {
    whereClause += ` LOWER(member_name) LIKE LOWER($${paramCount}) OR LOWER(book_title) LIKE LOWER($${paramCount}) OR barcode = $${paramCount}`;
    queryParams.push(`%${search}%`);
    paramCount++;
  }

  if (minDays !== null && minDays >= 0) {
    whereClause += (whereClause ? ' AND ' : '') + `days_overdue >= $${paramCount}`;
    queryParams.push(minDays);
    paramCount++;
  }

  const wherePrefix = whereClause ? ' WHERE ' : '';
  const countQuery = `SELECT COUNT(*) FROM vw_overdue_loans${wherePrefix}${whereClause}`;

  try {
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count) || 0;
    const totalPages = Math.ceil(total / PAGE) || 1;

    const dataQuery = `SELECT * FROM vw_overdue_loans${wherePrefix}${whereClause} ORDER BY days_overdue DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(PAGE, offset);
    
    const result = await query(dataQuery, queryParams);

    return {
      data: result.rows,
      total,
      page,
      pageSize: PAGE,
      totalPages,
    };
  } catch (err) {
    console.error('Database error in getOverdueLoans:', err);
    return {
      data: [],
      total: 0,
      page,
      pageSize: PAGE,
      totalPages: 1,
    };
  }
}

