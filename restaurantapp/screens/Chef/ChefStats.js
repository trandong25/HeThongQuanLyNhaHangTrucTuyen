import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState,useEffect,useCallback } from "react"
import { Dimensions, ScrollView, StyleSheet, View } from "react-native"
import { ActivityIndicator, Card, SegmentedButtons, Text } from "react-native-paper";
import { COLORS } from "../../styles/Styles";
import { authApis, endpoints } from "../../configs/APIs";
import { BarChart, LineChart } from "react-native-chart-kit";


const screenWidth = Dimensions.get("window").width
const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(230, 81, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
};
const ChefStats = () => {
    const[dishStats,setDishStats] = useState([])
    const[revenueData,setRevenueData] = useState([])
    const[loading,setLoading] = useState(false)
    const[period,setPeriod]= useState('week')

    const loadStats = async () => {
        try{
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const api = authApis(token);
            const [dishRes, revenueRes] = await Promise.all([
                api.get(endpoints['stats-dish']),
                api.get(`${endpoints['stats-revenue']}?period=${period}`),
            ]);
            setDishStats(dishRes.data || []);
            setRevenueData(revenueRes.data || []);

        } catch(error){
            console.error("Lỗi tải thống kê:",error)
        }finally{
            setLoading(false)
        }
    }
     useEffect(() => { loadStats(); }, [period]);
    const totalRevenue = revenueData.reduce((sum, d) => sum + (d.revenue || 0), 0);
    const totalDishes = dishStats.reduce((sum, d) => sum + (d.total_quantity || 0), 0);
      const revenueChartData = {
        labels: revenueData.slice(-7).map(d => {
            const date = new Date(d.day);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        }),
        datasets: [{
            data: revenueData.slice(-7).map(d => d.revenue || 0),
        }]
    };
    const sortedDishes = [...dishStats].sort((a, b) => (b.total_quantity || 0) - (a.total_quantity || 0));
    const top5Dishes = sortedDishes.slice(0, 5);
    const dishChartData = {
        labels: top5Dishes.map(d => d.dish__name?.substring(0, 6) + '...' || ''),
        datasets: [{
            data: top5Dishes.map(d => d.total_quantity || 0),
        }]
    };
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }
    return(
        <ScrollView style={styles.container}>
            <Text style={styles.header} >📊 Thống kê kinh doanh</Text>
            <View style={styles.summaryRow}>
                <Card style={styles.summaryCard}>
                    <Card.Content>
                        <Text style={styles.summaryLabel}>💰 Tổng doanh thu</Text>
                        <Text style={styles.summaryValue}>
                            {totalRevenue.toLocaleString('vi-VN')}đ
                        </Text>
                    </Card.Content>
                </Card>
                <Card style={styles.summaryCard}>
                    <Card.Content>
                        <Text style={styles.summaryLabel}>🍳 Số món đã chế biến</Text>
                        <Text style={styles.summaryValue}>{totalDishes} món</Text>
                    </Card.Content>
                </Card>
            </View>
            <SegmentedButtons
                value={period}
                onValueChange={setPeriod}
                style={{ margin: 16 }}
                buttons={[
                    { value: 'day',   label: 'Ngày' },
                    { value: 'week',  label: 'Tuần' },
                    { value: 'month', label: 'Tháng' },
                ]}
            />
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardTitle}>
                        📈 Doanh thu {period === 'day' ? 'theo ngày' : period === 'week' ? 'theo tuần' : 'theo tháng'}
                    </Text>
                    {revenueChartData.labels.length > 0 ? (
                        <LineChart
                            data={revenueChartData}
                            width={screenWidth - 64}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={{ borderRadius: 12, marginTop: 8 }}
                            fromZero={true}
                            formatYLabel={(yValue) => {
                                const y = parseInt(yValue);
                                if (y >= 1000000) return (y / 1000000).toFixed(1) + 'M';
                                if (y >= 1000) return (y / 1000).toFixed(0) + 'K';
                                return y.toString();
                            }}
                        />
                    ):(
                        <Text style={styles.empty}>Chưa có dữ liệu</Text>
                    )}
                </Card.Content>
            </Card>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardTitle}>🏆 Top 5 món được đặt nhiều nhất</Text>
                    {dishChartData.labels.length > 0 ? (
                        <BarChart
                            data={dishChartData}
                            width={screenWidth - 64}
                            height={200}
                            chartConfig={chartConfig}
                            style={{ borderRadius: 12, marginTop: 8 }}
                            showValuesOnTopOfBars
                        />
                    ):(
                        <Text style={styles.empty}>Chưa có dữ liệu</Text>
                    )}
                </Card.Content>
            </Card>
            <Card style={[styles.card, { marginBottom: 30 }]}>
                <Card.Content>
                    <Text style={styles.cardTitle}>📋 Chi tiết từng món</Text>
                    {dishStats.length === 0 ? (
                        <Text style={styles.empty}>Chưa có dữ liệu</Text>
                    ):(
                        dishStats.map((d,index) => (
                            <View key={index} style={styles.dishRow}>
                                <View style={styles.rank} >
                                    <Text style={styles.rankText}>{index + 1}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.dishName} numberOfLines={1}>{d.dish__name}</Text>
                                
                                    <Text style={styles.dishSub}>Số lượng:{d.total_quantity}</Text>
                                </View>
                                <Text style={styles.revenue}>{(d.revenue || 0).toLocaleString('vi-VN')}đ</Text>
                            </View>

                        ))
                    )}
                </Card.Content>
            </Card>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        fontSize: 20, fontWeight: 'bold',
        padding: 16, color: COLORS.primary,
        paddingTop:30,
    },
    summaryRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    summaryCard: {
        flex: 1, backgroundColor: '#fff', elevation: 2,
    },
    summaryLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
    summaryValue: {
        fontSize: 16, fontWeight: 'bold', color: COLORS.primary,
    },
    card: {
        margin: 16, marginTop: 0,
        backgroundColor: '#fff', elevation: 2, borderRadius: 12,
    },
    cardTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
    empty: { color: '#999', fontStyle: 'italic', textAlign: 'center', padding: 20 },
    dishRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
    },
    rank: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: COLORS.primary, justifyContent: 'center',
        alignItems: 'center', marginRight: 12,
    },
    rankText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    dishName: { fontWeight: '600', fontSize: 14 },
    dishSub: { color: '#888', fontSize: 12 },
    revenue: { color: COLORS.primary, fontWeight: 'bold' },
});
export default ChefStats;