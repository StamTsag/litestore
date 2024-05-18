export default function Loading() {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 m-auto w-max h-max">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="2" r="0" fill="hsl(var(--foreground))">
          <animate
            attributeName="r"
            begin="0"
            calcMode="spline"
            dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle
          cx="12"
          cy="2"
          r="0"
          fill="hsl(var(--foreground))"
          transform="rotate(45 12 12)"
        >
          <animate
            attributeName="r"
            begin="0.125s"
            calcMode="spline"
            dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle
          cx="12"
          cy="2"
          r="0"
          fill="hsl(var(--foreground))"
          transform="rotate(90 12 12)"
        >
          <animate
            attributeName="r"
            begin="0.25s"
            calcMode="spline"
            dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle
          cx="12"
          cy="2"
          r="0"
          fill="hsl(var(--foreground))"
          transform="rotate(135 12 12)"
        >
          <animate
            attributeName="r"
            begin="0.375s"
            calcMode="spline"
            dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle
          cx="12"
          cy="2"
          r="0"
          fill="hsl(var(--foreground))"
          transform="rotate(180 12 12)"
        >
          <animate
            attributeName="r"
            begin="0.5s"
            calcMode="spline"
            dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle
          cx="12"
          cy="2"
          r="0"
          fill="hsl(var(--foreground))"
          transform="rotate(225 12 12)"
        >
          <animate
            attributeName="r"
            begin="0.625s"
            calcMode="spline"
            dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle
          cx="12"
          cy="2"
          r="0"
          fill="hsl(var(--foreground))"
          transform="rotate(270 12 12)"
        >
          <animate
            attributeName="r"
            begin="0.75s"
            calcMode="spline"
            dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
        <circle
          cx="12"
          cy="2"
          r="0"
          fill="hsl(var(--foreground))"
          transform="rotate(315 12 12)"
        >
          <animate
            attributeName="r"
            begin="0.875s"
            calcMode="spline"
            dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            repeatCount="indefinite"
            values="0;2;0;0"
          />
        </circle>
      </svg>
    </div>
  );
}
