import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const Table = ({ columns, data, filterable = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = data.filter(item => {
    for (const key of filterable) {
      if (filters[key] && !String(item[key]).toLowerCase().includes(filters[key].toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="table-container glass-panel">
      {filterable.length > 0 && (
        <div className="table-filters">
          {filterable.map(f => (
            <input
              key={f}
              type="text"
              placeholder={`Filter by ${f}...`}
              className="input-field"
              style={{ maxWidth: '250px' }}
              onChange={(e) => handleFilterChange(f, e.target.value)}
            />
          ))}
        </div>
      )}
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} onClick={() => col.sortable && handleSort(col.key)}>
                <div className="th-content">
                  {col.label}
                  {col.sortable && sortConfig.key === col.key && (
                    sortConfig.direction === 'asc' ? <ArrowUp size={16}/> : <ArrowDown size={16}/>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center" style={{ padding: '2rem' }}>No data found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
