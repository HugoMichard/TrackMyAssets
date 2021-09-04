import { ResponsiveLine } from '@nivo/line'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export const PortfolioPlusValueHistoryChartData = [
  {
    "id": "portfolio_plus_value",
    "data": [
      {
        "x": "04/24/2000",
        "y": 1
      }]
  }
];

export function PortfolioPlusValueHistoryChart(data) {
  const values = data[0].data;
  const ordered_values = values.map(v => v.y).sort((a, b) => a - b);
  const y_max = ordered_values[values.length - 1];
  const y_min = ordered_values[0];
  const step = (y_max - y_min) / 6 
  const yRange = [y_min, y_min + step, y_min + 2 * step, y_min + 3 * step, y_min + 4 * step, y_min + 5 * step, y_min + 6 * step];
  return (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
        xScale={{ type: 'time', format: "%m/%d/%Y"}}
        yScale={{ type: 'linear', stacked: true, min: y_min, max: y_max }}
        yFormat=" >-.2f"
        xFormat="time:%d/%m/%Y"
        curve="monotoneX"
        axisTop={null}
        axisRight={{
            tickValues: yRange,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: '.2s',
            legend: '',
            legendOffset: 0
        }}
        axisBottom={{
            tickValues: "every 1 month",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: '%m/%Y',
            legend: 'Date',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            tickValues: yRange,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: '.2s',
            legend: 'Price',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        enableGridX={false}
        enableArea={true}
        areaBaselineValue={y_min}
        colors={{ scheme: 'category10' }}
        lineWidth={1}
        pointSize={4}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={1}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        gridYValues={yRange}
    />
)};