export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded border border-dashed border-ink-200 bg-paper-50">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-ink-100 flex items-center justify-center mb-4">
          <Icon size={22} className="text-ink-500" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-ink-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-500 max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  )
}
