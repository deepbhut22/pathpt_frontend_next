import { cn } from "@/lib/utils";

interface CardTitleProps {
    className?: string;
    children: React.ReactNode;
}

export default function CardTitle({ className, children }: CardTitleProps) {
    return (
        <h3 className={cn('text-lg font-semibold leading-7 text-secondary-900', className)}>
            {children}
        </h3>
    );
}