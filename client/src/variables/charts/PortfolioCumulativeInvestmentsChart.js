import { ResponsiveLine } from '@nivo/line'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export const PortfolioCumulativeInvestmentsChartData = [
  {
    "id": "portfolio_price",
    "data": [
      {
        "x": "04/24/2000",
        "y": 1
      }]
  }
];

export function PortfolioCumulativeInvestmentsChart(data) {

  return (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
        xScale={{ type: 'time', format: "%m/%d/%Y"}}
        yScale={{ type: 'linear', stacked: true }}
        yFormat=" >-.2f"
        xFormat="time:%d/%m/%Y"
        curve="monotoneX"
        axisTop={null}
        axisRight={{
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
            tickRotation: -50,
            format: '%m/%Y',
            legend: 'Date',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
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
        colors={{ scheme: 'category10' }}
        lineWidth={1}
        pointSize={4}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={1}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 60,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                      }
                  }
              ]
          }
      ]}
    />
)};