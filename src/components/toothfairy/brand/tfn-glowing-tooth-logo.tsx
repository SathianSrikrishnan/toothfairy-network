type TFNGlowingToothLogoProps = {
  className?: string
  size?: number
}

export function TFNGlowingToothLogo({ className = "", size = 42 }: TFNGlowingToothLogoProps) {
  return (
    <span
      className={className}
      aria-hidden
      style={{
        display: "grid",
        position: "relative",
        width: size,
        height: size,
        flex: "0 0 auto",
        placeItems: "center",
        overflow: "visible",
        transform: "translateZ(0)",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: "8% 2% 0",
          borderRadius: "52% 48% 58% 42%",
          background:
            "radial-gradient(ellipse at 48% 32%, rgba(255, 251, 219, 0.76), rgba(255, 220, 103, 0.28) 48%, transparent 74%)",
          filter: "blur(2px) drop-shadow(0 0 11px rgba(255, 224, 119, 0.72))",
          transform: "rotate(-8deg)",
        }}
      />
      <svg
        viewBox="0 0 64 76"
        fill="none"
        style={{
          position: "relative",
          zIndex: 1,
          width: "58%",
          height: "72%",
          overflow: "visible",
          transform: "rotate(-8deg)",
          filter:
            "drop-shadow(0 0 5px rgba(255, 253, 229, 0.72)) drop-shadow(0 4px 8px rgba(122, 83, 32, 0.22))",
        }}
      >
        <path
          d="M32.4 6.8c-9.2 0-16.8 7-17.5 16.4-.4 5.9 1.2 11.1 3.1 16.5 1.5 4.1 2.1 9.8 2.8 15.5.6 5.2 2.5 10 6 10 3 0 4.1-4.2 4.8-10 .3-2.8.8-5.2 1.1-6.3.4 1.1.9 3.5 1.2 6.3.7 5.8 1.8 10 4.8 10 3.6 0 5.4-4.8 6-10 .7-5.7 1.3-11.4 2.8-15.5 1.9-5.4 3.5-10.6 3.1-16.5-.7-9.4-8.7-16.4-18.2-16.4Z"
          fill="url(#tfnLogoToothFill)"
          stroke="url(#tfnLogoToothStroke)"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <path d="M20.6 24.7c5.5 3 16.6 3.5 23.7.1" stroke="#fff9d7" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M23.5 18.8c3.2-3.8 9.1-5.5 14.6-3.9" stroke="#ffffff" strokeWidth="2.3" strokeLinecap="round" opacity=".9" />
        <path d="M45.3 36.9c-1 3-1.7 6.4-2.1 10.1" stroke="#f3c762" strokeWidth="1.8" strokeLinecap="round" opacity=".72" />
        <defs>
          <linearGradient id="tfnLogoToothFill" x1="18" y1="9" x2="48" y2="67" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="0.46" stopColor="#fff8dd" />
            <stop offset="0.76" stopColor="#f3c762" />
            <stop offset="1" stopColor="#c98924" />
          </linearGradient>
          <linearGradient id="tfnLogoToothStroke" x1="19" y1="8" x2="49" y2="68" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff1af" />
            <stop offset="0.52" stopColor="#d8a43c" />
            <stop offset="1" stopColor="#9c6419" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  )
}
