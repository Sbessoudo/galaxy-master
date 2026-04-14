import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import GradeForm from '@/components/grades/GradeForm'

export const dynamic = 'force-dynamic'

export default async function EditGradePage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: grade } = await supabase
    .from('grades')
    .select('*')
    .eq('id', id)
    .single()

  if (!grade) notFound()

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/config/grades"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem', fontFamily: 'var(--font-label)', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Grades
        </Link>
        <span style={{ color: 'var(--color-on-surface-variant)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
          {grade.icon} {grade.name}
        </h1>
      </div>
      <div className="rounded-xl p-6" style={{ background: 'var(--color-surface-container)' }}>
        <GradeForm grade={grade} />
      </div>
    </div>
  )
}
