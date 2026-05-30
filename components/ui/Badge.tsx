import { cn } from "@/lib/utils";

type Variant = "default" | "premium" | "verified" | "new";

const variants: Record<Variant, string> = {
  default:  "bg-white/10 text-white/70",
  premium:  "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  verified: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  new:      "bg-green-500/20 text-green-400 border border-green-500/30",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}