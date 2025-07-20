'use client'

import Image from 'next/image'
import { useState } from 'react'

type ImageUploaderProps = {
  onChange: (url: string) => void
  value?: string
}

export default function ImageUploader({ onChange, value }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState(value || '')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    setPreviewUrl(data.url)
    onChange(data.url)
  }

  return (
    <div className="space-y-2 text-slate-800 dark:text-slate-200">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <Image
          src={previewUrl}
          alt="Uploaded Preview"
          width={150}
          height={100}
          className="rounded border mt-2"
        />
      )}
    </div>
  )
}
