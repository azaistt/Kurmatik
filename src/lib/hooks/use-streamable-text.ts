import { useEffect, useState } from 'react'

export const useStreamableText = (
  content: string | any
) => {
  const [rawContent, setRawContent] = useState(
    typeof content === 'string' ? content : ''
  )

  useEffect(() => {
    ;(async () => {
      if (typeof content === 'object' && content) {
        // For now, just extract string value if available
        const value = content.value || content.toString() || ''
        setRawContent(value)
      } else {
        setRawContent(content)
      }
    })()
  }, [content])

  return rawContent
}