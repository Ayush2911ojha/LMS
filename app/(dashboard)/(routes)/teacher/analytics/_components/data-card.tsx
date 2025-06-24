import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

interface DataCardProps {
    value: number;
    label: string;
    shouldFormat?: boolean;
}

export const DataCard = ({
    value,
    label,
    shouldFormat = true,
}: DataCardProps) => {
    return (
        <Card className="bg-gradient-to-r from-white via-blue-50 to-white shadow-lg border border-blue-100 rounded-2xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium text-gray-600 tracking-wide uppercase">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-extrabold text-blue-700 drop-shadow-sm">
                    {shouldFormat ? formatPrice(value) : value}
                </div>
            </CardContent>
        </Card>
    );
};
