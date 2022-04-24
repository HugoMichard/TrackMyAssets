import React, { Component } from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody
} from "reactstrap";

class EmptyWelcome extends Component {
    render() {
        return (
        <>
            <div className="content">
                <Card> 
                    <CardHeader tag="h4">{this.props.title}</CardHeader>
                    <CardBody>
                        <p>
                            Your portfolio is currently empty. To get started, <a href="/app/platforms/create">add some of the platforms you use</a>. Then <a href="/app/categories/create">create categories</a> in which you can <a href="/app/assets/create">add the assets you own</a> ! <br />
                            Finally, <a href="/app/orders/create">input the orders you make</a> and your portfolio will be tracked automatically with all of your assets ! <br/>
                            For more details, you can check the <a href="/docs/overview">documentation</a> or get in touch with me using my <a href="/">contact form</a>. For any issues or improvements, you can also drop me an issue on <a href="https://github.com/HugoMichard/TrackMyAssets">github</a>
                        </p>
                    </CardBody>
                </Card>
            </div>
        </>
        );
    }
}

export default EmptyWelcome;
