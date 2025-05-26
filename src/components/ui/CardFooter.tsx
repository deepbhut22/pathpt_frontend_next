import { cn } from "@/lib/utils";

interface CardFooterProps {
    className?: string;
    children: React.ReactNode;
}

export default function CardFooter({ className, children }: CardFooterProps) {
    return (
        <div className={cn('px-6 py-4 bg-secondary-50 border-t border-secondary-200', className)}>
            {children}
        </div>
    );
}