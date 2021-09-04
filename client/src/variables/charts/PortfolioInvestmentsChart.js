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
        "hot dog": 10,
        "test": 10
      }],
  keys: ["hot dog", "test"],
  colors: {"test": "hsl(230, 70%, 50%)", "hot dog": "hsl(230, 70%, 50%)"}
};


export function PortfolioInvestmentsChart(data, keys, getBarColor) {
  return (
    <ResponsiveBar
        data={data}
        margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
        indexBy="execution_date"
        keys={keys}
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
            tickRotation: 0,
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
    />
)};