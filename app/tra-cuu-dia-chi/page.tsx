'use client'

export default function TraCuuPage() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
      <iframe 
        src="/tra-cuu/index.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Tra cứu chuyển đổi địa chỉ"
        loading="lazy"
      />
    </div>
  )
}