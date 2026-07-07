import { useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const DataTable = ({ columns, data, loading, searchable, onSearch, title, actions, pageSize = 10 }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil((data?.length || 0) / pageSize);
  const paginatedData = data?.slice((page - 1) * pageSize, page * pageSize) || [];

  return (
    <div className="card !p-0 overflow-hidden">
      {(title || searchable || actions) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-gray-200 dark:border-gray-700">
          {title && <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {searchable && (
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  onChange={(e) => { onSearch?.(e.target.value); setPage(1); }}
                  className="input-field pl-9 py-2 text-sm"
                  placeholder="Search..."
                />
              </div>
            )}
            {actions}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              {columns.map((col, i) => (
                <th key={i} className="table-header">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="table-cell">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16 text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <FiSearch className="w-8 h-8 opacity-40" />
                    <p className="text-sm font-medium">No data found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.filter(Boolean).map((row, i) => (
                <tr key={row._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  {columns.map((col, j) => (
                    <td key={j} className="table-cell">
                      {col.render ? col.render(row) : (row ? row[col.accessor] : '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500">
            Page {page} of {totalPages} ({data?.length} total)
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="btn-secondary py-1 px-2 text-xs disabled:opacity-30"><FiChevronsLeft className="w-3.5 h-3.5" /></button>
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn-secondary py-1 px-2 text-xs disabled:opacity-30"><FiChevronLeft className="w-3.5 h-3.5" /></button>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 px-2">{page}</span>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="btn-secondary py-1 px-2 text-xs disabled:opacity-30"><FiChevronRight className="w-3.5 h-3.5" /></button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="btn-secondary py-1 px-2 text-xs disabled:opacity-30"><FiChevronsRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
