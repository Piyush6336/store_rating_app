import React from 'react';
import { ArrowDownUp } from 'lucide-react';

export default function SortableHeader({ label, field, sortBy, order, onSort }) {
  return (
    <button className="table-sort" onClick={() => onSort(field)}>
      <span>{label}</span>
      <ArrowDownUp size={14} />
      {sortBy === field ? <small>{order}</small> : null}
    </button>
  );
}
