import { ResponsiveBar } from '@nivo/bar'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export const PortfolioInvestmentsChartData = {
  data: [
      {
        "execution_date": "01-01-2020",
        "hot dog": 0,
        "test": 0
      }],
  keys: ["hot dog", "test"],
  colors: {"test": "hsl(230, 70%, 50%)", "hot dog": "hsl(230, 70%, 50%)"}
};


export function PortfolioInvestmentsChart(data, keys, getBarColor) {
  keys = keys.filter(k => k != null)
  return (
    <ResponsiveBar
        data={data}
        margin={{ top: 50, right: 160, bottom: 60, left: 60 }}
        indexBy="execution_date"
        keys={keys}
        yFormat=" >-.2f"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        valueFormat={{ format: ' >-', enabled: false }}
        colors={getBarColor}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -50,
            legend: 'Date',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Investment',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[
          {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemOpacity: 1
                      }
                  }
              ]
          }
        ]}
    />
)};