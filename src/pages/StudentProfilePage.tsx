{/* Email (Editable or Clickable Link) */}
<div>
  <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Email</label>
  {isEditing ? (
    <input
      type="email"
      value={editEmail}
      onChange={(e) => setEditEmail(e.target.value)}
      className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
      placeholder="name@example.com"
    />
  ) : (
    <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
      <Mail size={16} className="text-navy-400" />
      {canSeeEmail ? (
        <a href={`mailto:${student.email}`} className="text-navy-600 hover:underline">
          {student.email}
        </a>
      ) : (
        <span className="text-navy-400/50 italic">Hidden by privacy settings</span>
      )}
    </div>
  )}
</div>