import { redirect } from 'next/navigation';
import { getAnalytics } from '@/actions/get-analytics';
import { DataCard } from './_components/data-card';
import { Chart } from './_components/chart';
import { auth } from '@clerk/nextjs/server';

const AnalyticsPage = async () => {
    const { userId } = auth();
    if (!userId) {
        return redirect('/');
    }

    const {
        data,
        totalRevenue,
        totalSales,
    } = await getAnalytics(userId);

    return (
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen p-8">
            <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
                <DataCard label="Total Sales" value={totalSales} shouldFormat={false} />
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-3xl font-semibold mb-4">Sales Overview</h2>
                <Chart data={data} />
            </div>
        </div>
    );
}

export default AnalyticsPage;
