import { Pencil, Trash2 } from 'lucide-react'
import { getInitials, partyColor } from '../utils/format'
import { TableRowSkeleton } from './Skeleton'

export default function CandidateTable({ candidates, isLoading, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-100 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-paper-50 text-left text-xs font-medium text-ink-500">
            <th className="py-3 px-4 font-medium">Candidate</th>
            <th className="py-3 px-4 font-medium">Party</th>
            <th className="py-3 px-4 font-medium">Age</th>
            <th className="py-3 px-4 font-medium">Votes</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)}

          {!isLoading &&
            candidates.map((c) => (
              <tr key={c._id} className="border-b border-ink-100 last:border-0 hover:bg-paper-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                      style={{ backgroundColor: partyColor(c.party) }}
                    >
                      {getInitials(c.name)}
                    </span>
                    <span className="font-medium text-ink-900">{c.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-ink-600">{c.party}</td>
                <td className="py-3 px-4 text-ink-600">{c.age ?? '—'}</td>
                <td className="py-3 px-4 font-mono text-ink-700">{c.voteCount ?? 0}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(c)}
                      className="p-2 rounded-sm text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                      aria-label={`Edit ${c.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(c)}
                      className="p-2 rounded-sm text-ink-500 hover:text-signal-500 hover:bg-signal-50 transition-colors"
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
