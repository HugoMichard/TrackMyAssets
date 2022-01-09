import { ResponsivePie } from '@nivo/pie'
import { basicTooltip } from './tooltips/baseTooltip';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export const PortfolioAssetDistributionChartData = {
  data: [{
    "id": "portfolio_asset_distribution",
    "label": "portfolio_asset_distribution",
    "value": 0
  }],
  keys: ["portfolio_asset_distribution"]
};

export function PortfolioAssetDistributionChart(data, keys) {

  return (
    <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        startAngle={-180}
        activeOuterRadiusOffset={8}
        valueFormat=" >-.1p"
        colors={{scheme: 'category10'}}
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