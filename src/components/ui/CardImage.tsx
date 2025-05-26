import { cn } from "@/lib/utils";

interface CardImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function CardImage({ src, alt, className }: CardImageProps) {
    return (
        <div className={cn('w-full h-48 overflow-hidden', className)}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
        </div>
    );
}