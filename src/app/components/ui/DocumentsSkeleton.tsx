const shimmerBackground = `linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.10) 75%)`

export function DocumentsSkeleton() {
  return (
    <div aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '24px', minHeight: '190px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="sk" style={{ height: 14, width: 100, borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i * 0.08}s` }} />
          <div className="sk" style={{ height: 20, width: '82%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
          <div className="sk" style={{ height: 14, width: '100%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
          <div className="sk" style={{ height: 14, width: '64%', borderRadius: 8, backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
          <div className="sk" style={{ height: 36, width: 120, borderRadius: 8, marginTop: 'auto', backgroundImage: shimmerBackground, backgroundSize: '200% 100%', animationName: 'shimmer', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
