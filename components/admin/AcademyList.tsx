'use client'

import { useState } from 'react'
import AcademyApproval from './AcademyApproval'
import type { AcademyData } from './AcademyApproval'

export default function AcademyList({
  academies,
  type,
}: {
  academies: AcademyData[]
  type: 'pending' | 'active'
}) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {academies.map((academy) => (
        <AcademyApproval
          key={academy.id}
          academy={academy}
          type={type}
          editingId={editingId}
          onEditToggle={setEditingId}
        />
      ))}
    </div>
  )
}
