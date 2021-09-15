export function basicTooltip(input) {
    return (
        <div className="basic-tooltip">
          <div className="inside-basic-tooltip">
            <span className="tooltip-colorblock" style={{background:input.datum.color}}></span>
            <span>
              {input.datum.label + ": "} 
              <strong>
                {Math.round(input.datum.data.tooltipValue * 100) / 100 }
              </strong>
            </span>
          </div>
        </div>
    );
}