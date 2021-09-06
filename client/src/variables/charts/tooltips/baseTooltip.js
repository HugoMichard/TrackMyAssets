export function basicTooltip(input) {
  console.log(input.datum);
    return (
        <div className="basic-tooltip">
          <div className="inside-basic-tooltip">
            <span className="tooltip-colorblock" style={{background:input.datum.color}}></span>
            <span>
              {input.datum.label + ": "} 
              <strong>
                {input.datum.data.tooltipValue}
              </strong>
            </span>
          </div>
        </div>
    );
}  