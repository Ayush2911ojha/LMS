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
        <Card className="shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-700">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                    {shouldFormat ? formatPrice(value) : value}
                </div>
            </CardContent>
        </Card>
    );
}
