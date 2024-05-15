import React, { useEffect } from 'react';
// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;


interface DataPoint {
    x: Date;
    y: [number, number, number, number];
}

interface Props {
    data: DataPoint[];
    name: string;
}

class CandlestickChart extends React.Component<Props>  {
    render() {
        const { data } = this.props;
        const { name } = this.props;
        const options = {
            title: {
                text: name
            },
            axisX: {
                title: "Date and Time",
                valueFormatString: "YYYY-MM-DD HH:mm:ss" // Format for displaying date and time on x-axis
            },
            axisY: {
                title: "Price"
            },
            data: [{
                type: "candlestick",
                dataPoints: data.map(point => ({
                    x: new Date(point.x),
                    y: point.y
                }))
            }]
        };

        return (
            <div>
                <CanvasJSChart options={options} />
            </div>
        );
    }
}

export default CandlestickChart;