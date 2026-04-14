'use client'

/**
 * Shared form input with label and focus ring.
 * Replaces the duplicated onFocus/onBlur inline style pattern.
 */
export default function FormInput({
  label,
  optional = false,
  type = 'text',
  as = 'input',
  children,
  ...props
}) {
  const Tag = as

  return (
    <div>
      {label && (
        <label className="field-label">
          {label}
          {optional && <span style={{ opacity: 0.5, marginLeft: '0.25rem' }}>(optionnel)</span>}
        </label>
      )}
      {as === 'select' ? (
        <select className="field" {...props}>
          {children}
        </select>
      ) : (
        <Tag type={type} className="field" {...props} />
      )}
    </div>
  )
}
