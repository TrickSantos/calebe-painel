import React, { useEffect, useRef, useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Image } from 'antd'

interface Props {
  value: string
  onChange: any
}

const UploadButton: React.FC<Props> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false)
  const [imagem, setImagem] = useState(value)
  const fileInput = useRef<HTMLInputElement>(null)

  return (
    <div
      className="uploadButton"
      onClick={() => {
        if (fileInput.current) {
          fileInput.current.click()
        }
      }}
    >
      {imagem ? (
        <Image
          src={imagem}
          preview={false}
          style={{ width: 'auto', height: 80, overflow: 'hidden' }}
        />
      ) : (
        <PlusOutlined />
      )}
      <div style={{ marginTop: 8 }}>
        <input
          type="file"
          ref={fileInput}
          onChange={e => {
            setLoading(true)
            const reader = new FileReader()

            if (e.target.files) {
              reader.readAsDataURL(e.target.files[0])
              reader.onloadend = () => {
                setImagem(reader.result as string)
              }
              onChange(e.target.files[0])
            }
            setLoading(false)
          }}
        />
      </div>
    </div>
  )
}
export default UploadButton
