import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState,useEffect,useCallback } from "react"
import { Dimensions, ScrollView, StyleSheet, View } from "react-native"
import { ActivityIndicator, Appbar, Card, SegmentedButtons, Text } from "react-native-paper";
import Styles, { COLORS } from "../../styles/Styles"
import { authApis, endpoints } from "../../configs/APIs";
import { BarChart, LineChart } from "react-native-chart-kit";
import Style from "./Style";

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
            <View style={Style.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }
    return(
        <ScrollView style={Styles.container}>
             <Appbar.Header style={{ backgroundColor: COLORS.primary, justifyContent: 'center' }}>
                <Appbar.Content title="THỐNG KÊ KINH DOANH" titleStyle={{color: 'white', fontWeight: 'bold', textAlign: 'center' }} />
            </Appbar.Header>
            <View style={[Style.summaryRow, { marginTop: 20 }]}>
                <Card style={Style.summaryCard}>
                    <Card.Content>
                        <Text style={Style.summaryLabel}>💰 Tổng doanh thu</Text>
                        <Text style={Style.summaryValue}>
                            {totalRevenue.toLocaleString('vi-VN')}đ
                        </Text>
                    </Card.Content>
                </Card>
                <Card style={Style.summaryCard}>
                    <Card.Content>
                        <Text style={Style.summaryLabel}>🍳 Số món đã chế biến</Text>
                        <Text style={Style.summaryValue}>{totalDishes} món</Text>
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
            <Card style={Style.card}>
                <Card.Content>
                    <Text style={Style.cardTitle}>
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
                        <Text style={Style.empty}>Chưa có dữ liệu</Text>
                    )}
                </Card.Content>
            </Card>
            <Card style={Style.card}>
                <Card.Content>
                    <Text style={Style.cardTitle}>🏆 Top 5 món được đặt nhiều nhất</Text>
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
                        <Text style={Style.empty}>Chưa có dữ liệu</Text>
                    )}
                </Card.Content>
            </Card>
            <Card style={[Style.card, { marginBottom: 30 }]}>
                <Card.Content>
                    <Text style={Style.cardTitle}>📋 Chi tiết từng món</Text>
                    {dishStats.length === 0 ? (
                        <Text style={Style.empty}>Chưa có dữ liệu</Text>
                    ):(
                        dishStats.map((d,index) => (
                            <View key={index} style={Style.dishRow}>
                                <View style={Style.rank} >
                                    <Text style={Style.rankText}>{index + 1}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={Style.dishName} numberOfLines={1}>{d.dish__name}</Text>
                                
                                    <Text style={Style.dishSub}>Số lượng:{d.total_quantity}</Text>
                                </View>
                                <Text style={Style.revenue}>{(d.revenue || 0).toLocaleString('vi-VN')}đ</Text>
                            </View>

                        ))
                    )}
                </Card.Content>
            </Card>
        </ScrollView>
    )
}
export default ChefStats;