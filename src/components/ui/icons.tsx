'use client'

import * as React from 'react'

import { cn } from '../../lib/utils'

function IconGroq({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={cn('size-4', className)}
      {...props}
    >
      <defs>
        <style>{`.cls-1{fill:#f55036;}.cls-2{fill:#fff;}`}</style>
      </defs>
      <title>groq_endicon</title>
      <g id="Layer_1" data-name="Layer 1">
        <rect className="cls-1" width="24" height="24" />
        <path
          className="cls-2"
          d="M12,4.85a5.03,5.03,0,1,0,0,10.05h1.65V12.83H12a3.14,3.14,0,1,1,3.14-3.14h0v4.63h0a3.1,3.1,0,0,1-4.87,2.51L8.51,17.87A5.01,5.01,0,0,0,12,19.34h.07a5.04,5.04,0,0,0,5-5.02V9.56A5.04,5.04,0,0,0,12,4.85Z"
        />
      </g>
    </svg>
  )
}

function IconUser({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z" />
    </svg>
  )
}

function IconCheck({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

function IconCopy({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8ZM176 176H48V96h128Zm32-48h-24V88a8 8 0 0 0-8-8H96V48h120Z" />
    </svg>
  )
}

function IconDownload({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M224 152v56a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-56a8 8 0 0 1 16 0v56h160v-56a8 8 0 0 1 16 0ZM88 120h32v64a8 8 0 0 1-16 0v-44.69l-18.34 18.35a8 8 0 0 1-11.32-11.32l32-32a8 8 0 0 1 11.32 0l32 32a8 8 0 0 1-11.32 11.32L128 139.31V184a8 8 0 0 1-16 0v-64H88a8 8 0 0 1 0-16Z" />
    </svg>
  )
}

export {
  IconGroq,
  IconUser,
  IconCheck,
  IconCopy,
  IconDownload
}