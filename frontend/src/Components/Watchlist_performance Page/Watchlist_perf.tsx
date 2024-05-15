import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material';
import CandlestickChart from './GraphPlotter';

interface company_details {
    watchlist: string;
    name: string;
    symbol: string;
    perf_today: number;
    perf_10day: number;
    perf_30day: number;
    high_today: number;
    high_10day: number;
    high_30day: number;
    low_today: number;
    low_10day: number;
    low_30day: number;
}
interface PerfMetrics {
    max_perf_today: company_details;
    min_perf_today: company_details;
    max_perf_10day: company_details;
    min_perf_10day: company_details;
    max_perf_30day: company_details;
    min_perf_30day: company_details;
}

interface PerfMetricsCompany {
    asset_type: string,
    exchange: string,
    high_10day: number,
    high_30day: number,
    high_today: number,
    low_10day: number,
    low_30day: number,
    low_today: number,
    name: string,
    perf_10day: number,
    perf_30day: number,
    perf_today: number,
    symbol: string,
}


interface DefaultPerfProps {
    perfMetrics: PerfMetrics | null;
    watchlistname: number | null;
    selectedCompany: string;
    csrfToken: string;
}

interface DataPoint {
    x: Date;
    y: [number, number, number, number];
}


const Watchlist_perf: React.FC<DefaultPerfProps> = ({ perfMetrics, watchlistname, selectedCompany, csrfToken }) => {
    const [graphdata, setGraphData] = useState<DataPoint[]>([])
    const [perfMetricsCompany, setPerfMetricsCompany] = useState<PerfMetricsCompany>()

    const getCompanyGraph = () => {
        fetch("http://127.0.0.1:8000/user/getCompanyGraph/", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ 'selectedCompany': selectedCompany }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setGraphData(data['candlestick_data'])
                setPerfMetricsCompany(data['perf_metrics'])
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
    useEffect(() => {
        getCompanyGraph()
    }, [selectedCompany])
    useEffect(() => {
        console.log(perfMetricsCompany)
    }, [perfMetricsCompany])


    const maincontent: React.ReactNode = (
        <div>
            <Grid container spacing={2} style={{ textAlign: 'center' }}>
                <Grid item md={4} xs={12}>
                    <Grid>
                        <Grid>
                            <Typography className="white" variant="h6" component="div">
                                Today
                            </Typography>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6} className="perf_card_container">

                                <Card className="perf_card">
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            Best Performer
                                        </Typography>
                                        <Typography variant="body2">
                                            {perfMetrics?.max_perf_today?.name}
                                        </Typography>
                                        <Typography variant="body2" style={perfMetrics?.max_perf_today?.perf_today && perfMetrics?.max_perf_today?.perf_today >= 0 ? { color: 'green' } : { color: 'red' }}>
                                            {perfMetrics?.max_perf_today?.perf_today.toFixed(4)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} className="perf_card_container">
                                <Card className="perf_card" >
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            Worst Performer
                                        </Typography>
                                        <Typography variant="body2">
                                            {perfMetrics?.min_perf_today?.name}
                                        </Typography>
                                        <Typography variant="body2" style={perfMetrics?.min_perf_today?.perf_today && perfMetrics?.min_perf_today?.perf_today >= 0 ? { color: 'green' } : { color: 'red' }}>
                                            {perfMetrics?.min_perf_today?.perf_today.toFixed(4)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Second Column */}
                <Grid item md={4} xs={12}>
                    <Grid>
                        <Grid>
                            <Typography className="white" variant="h6" component="div">
                                10 days
                            </Typography>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6} className="perf_card_container">

                                <Card className="perf_card">
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            Best Performer
                                        </Typography>
                                        <Typography variant="body2">
                                            {perfMetrics?.max_perf_10day?.name}
                                        </Typography>
                                        <Typography variant="body2" style={perfMetrics?.max_perf_10day?.perf_10day && perfMetrics?.max_perf_10day?.perf_10day >= 0 ? { color: 'green' } : { color: 'red' }}>
                                            {perfMetrics?.max_perf_10day?.perf_10day.toFixed(4)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} className="perf_card_container">
                                <Card className="perf_card" >
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            Worst Performer
                                        </Typography>
                                        <Typography variant="body2">
                                            {perfMetrics?.min_perf_10day?.name}
                                        </Typography>
                                        <Typography variant="body2" style={perfMetrics?.min_perf_10day?.perf_10day && perfMetrics?.min_perf_10day?.perf_10day >= 0 ? { color: 'green' } : { color: 'red' }}>
                                            {perfMetrics?.min_perf_10day?.perf_10day.toFixed(4)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Third Column */}
                <Grid item md={4} xs={12}>
                    <Grid>
                        <Grid>
                            <Typography className="white" variant="h6" component="div">
                                30 days
                            </Typography>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6} className="perf_card_container">

                                <Card className="perf_card">
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            Best Performer
                                        </Typography>
                                        <Typography variant="body2">
                                            {perfMetrics?.max_perf_30day?.name}
                                        </Typography>
                                        <Typography variant="body2" style={perfMetrics?.max_perf_30day?.perf_30day && perfMetrics?.max_perf_30day?.perf_30day >= 0 ? { color: 'green' } : { color: 'red' }}>
                                            {perfMetrics?.max_perf_30day?.perf_30day.toFixed(4)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} className="perf_card_container">
                                <Card className="perf_card" >
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            Worst Performer
                                        </Typography>
                                        <Typography variant="body2">
                                            {perfMetrics?.max_perf_30day?.name}
                                        </Typography>
                                        <Typography variant="body2" style={perfMetrics?.min_perf_30day?.perf_30day && perfMetrics?.min_perf_30day?.perf_30day >= 0 ? { color: 'green' } : { color: 'red' }}>
                                            {perfMetrics?.min_perf_30day?.perf_30day.toFixed(4)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {selectedCompany !== "" && (

                <Grid className='mt-3' container>
                    <Grid md={6} xs={12}>
                        <CandlestickChart data={graphdata} name={selectedCompany} />
                    </Grid>
                    <Grid md={6} xs={12}>
                        <Card className="perf_card" style={{ marginLeft: '1rem', marginRight: '1rem', marginBottom: '1rem' }}>
                            <CardContent>
                                <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                    Today
                                </Typography>
                                <Grid container>
                                    <Grid xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                            High: {perfMetricsCompany?.high_today}
                                        </Typography>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                            Low: {perfMetricsCompany?.low_today}
                                        </Typography>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                            Performance: {perfMetricsCompany?.perf_today.toFixed(4)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card className="perf_card m-3">
                            <CardContent>
                                <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                    10 Days
                                </Typography>
                                <Grid container>
                                    <Grid xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                            High: {perfMetricsCompany?.high_10day}
                                        </Typography>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                            Low: {perfMetricsCompany?.low_10day}
                                        </Typography>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                            Performance: {perfMetricsCompany?.perf_10day.toFixed(4)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card className="perf_card" style={{ marginLeft: '1rem', marginRight: '1rem', marginTop: '1rem' }}>
                            <CardContent>
                                <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                    30 Days
                                </Typography>
                                <Grid container>
                                    <Grid xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                            High: {perfMetricsCompany?.high_30day}
                                        </Typography>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                            Low: {perfMetricsCompany?.low_30day}
                                        </Typography>
                                    </Grid>
                                    <Grid xs={4}>
                                        <Typography style={{ textAlign: 'center' }} variant="h6" component="div">
                                            Performance: {perfMetricsCompany?.perf_30day.toFixed(4)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            )}
        </div>

    );

    return maincontent;
}

export default Watchlist_perf;