import { cn } from "@/lib/utils";

interface CardContentProps {
    className?: string;
    children: React.ReactNode;
}

export default function CardContent({ className, children }: CardContentProps) {
    return (
        <div className={cn('p-6 pt-0', className)}>
            {children}
        </div>
    );
}