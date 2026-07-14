import React from "react";

interface LogoProps {
  /**
   * Layout type: 
   * - "vertical": Emblem stacked above "ASHWASH" and "MENTAL WELLNESS"
   * - "horizontal": Emblem on the left, "ASHWASH" on the right (ideal for navbars)
   * - "icon-only": Just the emblem itself
   */
  layout?: "vertical" | "horizontal" | "icon-only";
  /** Size of the emblem (height/width in pixels) */
  size?: number;
  /** Custom class for additional styling */
  className?: string;
  /** Show the subtle paper texture card behind the logo (similar to the uploaded asset) */
  showCardBackground?: boolean;
}

export default function Logo({
  layout = "vertical",
  size = 140,
  className = "",
  showCardBackground = false
}: LogoProps) {
  // Sage green in the reference logo: #8CA58D
  // Dark forest green in the reference logo: #1D4035
  const sageColor = "#8CA58D";
  const forestColor = "#1D4035";

  const emblemSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      {/* Background/Shadow Group if needed, but keeping it clean & flat vector as requested */}
      <g>
        {/* TOP LOBE - Sage Green (#8CA58D) */}
        <path
          d="M 160,260 
             C 150,195 190,135 270,130 
             C 350,125 410,165 415,225 
             C 395,215 365,205 325,215 
             C 285,225 255,215 230,185 
             C 210,160 185,160 160,182 
             C 159,208 159,235 160,260 Z"
          fill={sageColor}
        />

        {/* BOTTOM RIGHT LOBE - Deep Forest Green (#1D4035) */}
        <path
          d="M 312,235 
             C 345,218 385,220 422,235 
             C 424,258 418,290 382,320 
             C 352,345 298,362 245,360 
             C 230,360 215,357 202,354 
             C 204,324 222,304 252,289 
             C 282,274 298,258 312,235 Z"
          fill={forestColor}
        />

        {/* BOTTOM LEFT LOBE - Deep Forest Green (#1D4035) */}
        <path
          d="M 164,272 
             C 165,250 178,225 200,215 
             C 215,205 230,212 244,232 
             C 264,257 282,270 300,273 
             C 288,293 270,308 240,320 
             C 210,332 192,348 185,356 
             C 172,345 161,325 161,295 
             C 161,287 162,280 164,272 Z"
          fill={forestColor}
        />
        
        {/* River outline highlight stroke overlay for seamless crisp blending */}
        <path
          d="M 160,182 C 185,160 210,160 230,185 C 255,215 285,225 325,215 C 365,205 395,215 415,225"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 202,354 C 204,324 222,304 252,289 C 282,274 298,258 312,235"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 200,215 C 215,205 230,212 244,232 C 264,257 282,270 300,273"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  const textGroup = (
    <div className="flex flex-col items-center text-center mt-3">
      {/* ASHWASH heading */}
      <span 
        className="font-sans font-medium uppercase tracking-[0.25em] text-deep-pine leading-none"
        style={{ 
          fontSize: `${Math.max(16, size * 0.16)}px`, 
          color: forestColor,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        ASHWASH
      </span>
      {/* MENTAL WELLNESS subheading */}
      <span 
        className="font-sans font-bold uppercase tracking-[0.38em] text-secondary/70 mt-1.5 leading-none"
        style={{ 
          fontSize: `${Math.max(9, size * 0.075)}px`,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        MENTAL WELLNESS
      </span>
    </div>
  );

  const content = () => {
    switch (layout) {
      case "icon-only":
        return emblemSvg;
      case "horizontal":
        return (
          <div className={`flex items-center gap-3 ${className}`}>
            {emblemSvg}
            <div className="flex flex-col items-start justify-center">
              <span 
                className="font-sans font-semibold uppercase tracking-[0.22em] text-deep-pine leading-none"
                style={{ 
                  fontSize: `${Math.max(15, size * 0.15)}px`, 
                  color: forestColor 
                }}
              >
                ASHWASH
              </span>
              <span 
                className="font-sans font-bold uppercase tracking-[0.3em] text-secondary/60 mt-1 leading-none"
                style={{ 
                  fontSize: `${Math.max(8, size * 0.07)}px` 
                }}
              >
                MENTAL WELLNESS
              </span>
            </div>
          </div>
        );
      case "vertical":
      default:
        return (
          <div className={`flex flex-col items-center justify-center ${className}`}>
            {emblemSvg}
            {textGroup}
          </div>
        );
    }
  };

  if (showCardBackground) {
    return (
      <div className="bg-[#FAF9F5] p-10 rounded-[3rem] shadow-sm border border-stone-200/40 inline-flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle Paper Texture emulation */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1c3d33_1px,transparent_1px)] [background-size:16px_16px]" />
        {content()}
      </div>
    );
  }

  return content();
}
