export function orderQuantityTooltip(orderDates, input) {
  const index = orderDates.findIndex(d => d.execution_date === new Date(input.point.data.x).toISOString().slice(0, 10).replace('T', ' '));
  const noOrder = index === -1 || orderDates[index].quantity === 0
  const color =  noOrder ? "rgb(31, 119, 180)" : orderDates[index].quantity > 0 ? 'green' : 'red';
    return (
        <div className="basic-tooltip">
          <div className="inside-basic-tooltip">
            <span className="tooltip-colorblock" style={{background: color}}></span>
            <span>
              {input.point.data.xFormatted + ": "} 
              <strong>
                {input.point.data.yFormatted}
              </strong>
              {noOrder ? "" : orderDates[index].quantity > 0 ? " Quantity bought: " : " Quantity sold: "}
              <strong>
                {noOrder ? "" : Math.abs(orderDates[index].quantity)}
              </strong>
            </span>
          </div>
        </div>
    );
}