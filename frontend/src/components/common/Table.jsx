import React from 'react';

/**
 * Tableau générique réutilisable
 */
const Table = ({ headers, data, renderRow }) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', border: '1px solid var(--gray-200)', borderRadius: 'var(--border-radius)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'var(--white)' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--light-color)', borderBottom: '2px solid var(--gray-200)' }}>
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                style={{
                  padding: '1rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: 'var(--gray-600)',
                  textTransform: 'uppercase'
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td 
                colSpan={headers.length} 
                style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}
              >
                Aucune donnée disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
