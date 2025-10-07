// Simplified CodeBlock component

'use client'

import { FC, memo } from 'react'

interface Props {
  language: string
  value: string
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  return (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
      <code className={`language-${language}`}>
        {value}
      </code>
    </pre>
  )
})
CodeBlock.displayName = 'CodeBlock'

export { CodeBlock }