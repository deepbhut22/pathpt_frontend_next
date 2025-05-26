import { cn } from "@/lib/utils";

interface CardDescriptionProps {
    className?: string;
    children: React.ReactNode;
}

export default function CardDescription({ className, children }: CardDescriptionProps) {
    return (
        <p className={cn('text-sm leading-6 text-secondary-600 mt-1', className)}>
            {children}
        </p>
    );
}