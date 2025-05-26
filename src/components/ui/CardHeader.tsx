import { cn } from "@/lib/utils";

interface CardHeaderProps {
    className?: string;
    children: React.ReactNode;
}

export default function CardHeader({ className, children }: CardHeaderProps) {
    return (
        <div className={cn('p-6 pb-2', className)}>
            {children}
        </div>
    );
}