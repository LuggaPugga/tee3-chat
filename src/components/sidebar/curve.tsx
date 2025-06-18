export function Curve() {
  return (
    <div className="fixed right-0 top-0 z-20 h-16 w-28 max-sm:hidden">
      <div
        className="group pointer-events-none absolute top-3.5 z-10 -mb-8 h-32 w-full origin-top transition-all ease-snappy"
        style={{
          boxShadow: "10px -10px 8px 2px hsl(var(--gradient-noise-top))",
        }}
      >
        <svg
          className="absolute -right-8 h-9 origin-top-left skew-x-[30deg] overflow-visible"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 128 32"
          xmlSpace="preserve"
        >
          <line
            stroke="var(--gradient-noise-top)"
            strokeWidth="2px"
            shapeRendering="optimizeQuality"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeMiterlimit="10"
            x1="1"
            y1="0"
            x2="128"
            y2="0"
          ></line>
          <path
            stroke="var(--chat-border)"
            className="translate-y-[0.5px]"
            fill="var(--gradient-noise-top)"
            shapeRendering="optimizeQuality"
            strokeWidth="1px"
            strokeLinecap="round"
            strokeMiterlimit="10"
            vectorEffect="non-scaling-stroke"
            d="M0,0c5.9,0,10.7,4.8,10.7,10.7v10.7c0,5.9,4.8,10.7,10.7,10.7H128V0"
          ></path>
        </svg>
      </div>
    </div>
  )
}
