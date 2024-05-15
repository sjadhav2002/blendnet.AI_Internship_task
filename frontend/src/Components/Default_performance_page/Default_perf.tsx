import React from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material';

interface company_details{
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

interface DefaultPerfProps {
    perfMetrics: PerfMetrics | null;
}

const Default_perf: React.FC<DefaultPerfProps> = ({perfMetrics}) => {
    const maincontent: React.ReactNode = (
        <Grid container spacing={2} style={{textAlign:'center'}}>
                        {/* First Column */}
                        
                            
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
                                        <Typography variant="body2" style={perfMetrics?.max_perf_today?.perf_today && perfMetrics?.max_perf_today?.perf_today >=0?{color:'green'}:{ color:'red'}}>
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
                                        <Typography variant="body2" style={perfMetrics?.min_perf_today?.perf_today && perfMetrics?.min_perf_today?.perf_today >=0?{color:'green'}:{ color:'red'}}>
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
                                        <Typography variant="body2" style={perfMetrics?.max_perf_10day?.perf_10day && perfMetrics?.max_perf_10day?.perf_10day >=0?{color:'green'}:{ color:'red'}}>
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
                                        <Typography variant="body2" style={perfMetrics?.min_perf_10day?.perf_10day && perfMetrics?.min_perf_10day?.perf_10day >=0?{color:'green'}:{ color:'red'}}>
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
                                        <Typography variant="body2" style={perfMetrics?.max_perf_30day?.perf_30day && perfMetrics?.max_perf_30day?.perf_30day >=0?{color:'green'}:{ color:'red'}}>
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
                                        {perfMetrics?.min_perf_30day?.name}
                                        </Typography>
                                        <Typography variant="body2" style={perfMetrics?.min_perf_30day?.perf_30day && perfMetrics?.min_perf_30day?.perf_30day >=0?{color:'green'}:{ color:'red'}}>
                                        {perfMetrics?.min_perf_30day?.perf_30day.toFixed(4)}
                                        </Typography>
                                    </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                        </Grid>
                        </Grid>
    );

    return maincontent;
}

export default Default_perf;