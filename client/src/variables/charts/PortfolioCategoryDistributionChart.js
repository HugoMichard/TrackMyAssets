import { ResponsivePie } from '@nivo/pie'
import { basicTooltip } from './tooltips/baseTooltip';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export const PortfolioCategoryDistributionChartData = {
  data: [{
    "id": "portfolio_category_distribution",
    "label": "portfolio_category_distribution",
    "value": 0
  }],
  keys: ["portfolio_category_distribution"],
  colors: {"portfolio_category_distribution": "#000000"}
};

export function PortfolioCategoryDistributionChart(data, keys, colors) {

  return (
    <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        startAngle={-180}
        activeOuterRadiusOffset={8}
        valueFormat=" >-p"
        colors={colors}
        keys={keys}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabel={'label'}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
        tooltip={basicTooltip}
    />
    );
}