import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import GradeActions from '@/components/grades/GradeActions'

export const dynamic = 'force-dynamic'

export default async function ConfigGradesPage() {
  const supabase = await createClient()

  const { data: grades } = await supabase
    .from('grades')
    .select('*')
    .order('min_points', { ascending: true })

  return (
    <div className="max-w-3xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p style={{
            fontFamily: 'var(--font-label)', fontSize: '0.6rem', color: 'var(--color-tertiary)',
            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem',
          }}>
            Configuration
          </p>
          <h1 style={{
            fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800,
            color: 'var(--color-on-surface)', lineHeight: 1.1,
          }}>
            Grades
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
            {grades?.length ?? 0} niveaux · triés par seuil de points croissant
          </p>
        </div>
        <Link href="/config/grades/new" className="btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
          Nouveau grade
        </Link>
      </div>

      {/* List */}
      {!grades?.length ? (
        <div className="rounded-xl p-12 text-center" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-outlined mb-3" style={{ color: 'var(--color-tertiary)', fontSize: '2.5rem', display: 'block' }}>
            military_tech
          </span>
          <p style={{ fontFamily: 'var(--font-headline)', color: 'var(--color-on-surface)', fontWeight: 700 }}>
            Aucun grade configuré
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-container)' }}>
          {grades.map((grade, i) => (
            <div key={grade.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderBottom: i < grades.length - 1 ? '1px solid rgb(255 255 255 / 0.04)' : 'none',
            }}>
              {/* Icon + color swatch */}
              <div style={{
                width: '2.2rem', height: '2.2rem', borderRadius: '0.5rem', flexShrink: 0,
                background: grade.color + '22',
                border: `1px solid ${grade.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}>
                {grade.icon}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p style={{
                  fontFamily: 'var(--font-label)', fontSize: '0.85rem', fontWeight: 700,
                  color: grade.color,
                }}>
                  {grade.name}
                </p>
              </div>

              {/* Threshold */}
              <span style={{
                fontFamily: 'var(--font-headline)', fontSize: '0.88rem', fontWeight: 800,
                color: 'var(--color-on-surface-variant)', flexShrink: 0,
              }}>
                {grade.min_points.toLocaleString('fr-FR')} pts
              </span>

              {/* Actions */}
              <Link href={`/config/grades/${grade.id}`} className="btn-ghost"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>edit</span>
              </Link>
              <GradeActions id={grade.id} name={grade.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
