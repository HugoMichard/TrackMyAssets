import React, {Component} from "react";
import APIService from "routers/apiservice";


export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processingMailToBeSent: false
        }
        this.sendContactMail = this.sendContactMail.bind(this);
    }
    launchApp(e) {
        e.preventDefault();
        window.location = "/login"
    }
    gotoDoc(e) {
        e.preventDefault();
        window.location = "/docs/overview"
    }
    sendContactMail(e) {
        e.preventDefault();
        if(!this.state.processingMailToBeSent) {
            this.setState({processingMailToBeSent: true})
            const data = {
                email: document.getElementById('email').value,
                name: document.getElementById('name').value,
                message: document.getElementById('message').value
            }
            APIService.sendContactMail(data)
            .then(res => {
                this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
                this.setState({processingMailToBeSent: false})
            }).catch(err => {
                this.props.displayNotification(this.props.notify, err.response.data.notif.text, err.response.data.notif.color);
                this.setState({processingMailToBeSent: false})
            });
        }
    }

  render() {
    return (
      <>
      <div className="main-landing">
        <div className="landing-container">
            <img
                alt="..."
                className="img-no-padding img-responsive full_width_image"
                src={require("assets/images/shape.png").default}
                />
            <div className="landing_text">
                <h1 className="landing-title">TrackMyAssets</h1>
                <h2 className="landing-sub-title">Follow all your portfolio assets from one single customizable platform</h2>
                <h3>Ready for the adventure ?</h3>
                <button className="glow-on-hover" type="button" onClick={this.launchApp}>
                    LAUNCH THE APP
                </button>
            </div>
        </div>

        <div className="raising-card-section">
            <h1 className="section-title">An amazing journey begins !</h1>
            <div className="raising-cards">
                <div className="raising-card">
                    <div className="raising-card-content">
                    <h2 className="raising-card-title">Enjoy the Stock Market Beach</h2>
                    <p className="raising-copy">Sunbathe in the Stock Market and monitor your portfolio with our no sunburn guarantee</p>
                    </div>
                </div>
                <div className="raising-card">
                    <div className="raising-card-content">
                    <h2 className="raising-card-title">Climb Crypto Mountains</h2>
                    <p className="raising-copy">Ascend all of these gorgeous pump mounts and admire from above the splendid dip valley views</p>
                    </div>
                </div>
                <div className="raising-card">
                    <div className="raising-card-content">
                    <h2 className="raising-card-title">Monitor your Fix Value Desert</h2>
                    <p className="raising-copy">It's the desert you've always dreamed of never going to anymore, and you won't have to go anymore</p>
                    </div>
                </div>
                <div className="raising-card">
                    <div className="raising-card-content">
                    <h2 className="raising-card-title">Explore Galaxies of Opportunities</h2>
                    <p className="raising-copy">Seriously, board with your bag of assets, get ready for takeoff, and just straight up aim for the moon !</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="tile-main-content">
            <img
                alt="..."
                className="img-no-padding img-responsive full_width_image shape-image"
                src={require("assets/images/shape_black.png").default}
            />
            <div class="tile-section">
                <h1 className="section-title">TrackMyAssets in a few words</h1>
                <div class="tile-cols">
                    <div class="tile-col" ontouchstart="this.classList.toggle('hover');">
                    <div class="tile-container">
                        <div class="tile-front">
                        <div class="tile-inner">
                            <p>Record</p>
                            <span>your transactions</span>
                        </div>
                        </div>
                        <div class="tile-back">
                        <div class="tile-inner">
                            <p>Record all the orders you make, on all the platforms you use</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="tile-col" ontouchstart="this.classList.toggle('hover');">
                    <div class="tile-container">
                        <div class="tile-front">
                        <div class="tile-inner">
                            <p>Track</p>
                            <span>your portfolio</span>
                        </div>
                        </div>
                        <div class="tile-back">
                        <div class="tile-inner">
                            <p>Check the data of all your assets on one single platform</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="tile-col" ontouchstart="this.classList.toggle('hover');">
                    <div class="tile-container">
                        <div class="tile-front">
                        <div class="tile-inner">
                            <p>Evaluate</p>
                            <span>your performances</span>
                        </div>
                        </div>
                        <div class="tile-back">
                        <div class="tile-inner">
                            <p>Compare your performances accross asset categories and platforms in a single click</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="tile-col" ontouchstart="this.classList.toggle('hover');">
                    <div class="tile-container">
                        <div class="tile-front">
                        <div class="tile-inner">
                            <p>Improve</p>
                            <span>your savings</span>
                        </div>
                        </div>
                        <div class="tile-back">
                        <div class="tile-inner">
                            <p>Distribute your investments better to capitalize on your wealth</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="tile-col" ontouchstart="this.classList.toggle('hover');">
                    <div class="tile-container">
                        <div class="tile-front">
                        <div class="tile-inner">
                            <p>Simple</p>
                            <span>to use and understand</span>
                        </div>
                        </div>
                        <div class="tile-back">
                        <div class="tile-inner">
                            <p>No unneccessary data, steps and process. Here everything is transparent !</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="tile-col" ontouchstart="this.classList.toggle('hover');">
                    <div class="tile-container">
                        <div class="tile-front">
                        <div class="tile-inner">
                            <p>Free</p>
                            <span>open-source application</span>
                        </div>
                        </div>
                        <div class="tile-back">
                        <div class="tile-inner">
                            <p>This app is as free as it gets !</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="tile-col" ontouchstart="this.classList.toggle('hover');">
                    <div class="tile-container">
                        <div class="tile-front">
                        <div class="tile-inner">
                            <p>Custom</p>
                            <span>to your needs</span>
                        </div>
                        </div>
                        <div class="tile-back">
                        <div class="tile-inner">
                            <p>The app is customizable to your asset and portfolio type</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="tile-col" ontouchstart="this.classList.toggle('hover');">
                    <div class="tile-container">
                        <div class="tile-front">
                        <div class="tile-inner">
                            <p>Diverse</p>
                            <span>assets supported</span>
                        </div>
                        </div>
                        <div class="tile-back">
                        <div class="tile-inner">
                            <p>Stock market, cryptos, fix value assets, dex wallets and much more are accessible !</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <button className="fill-in" onClick={this.gotoDoc}>Checkout the details here</button>
                </div>
            </div>
        </div>

        <div className="contact-main-content">
            <img
                alt="..."
                className="img-no-padding img-responsive full_width_image shape-image"
                src={require("assets/images/shape.png").default}
            />
            <section class="contact-section">
                <h1 class="section-title">Need some help ? An idea or suggestion ? Get in touch !</h1>
                <form class="contact-form contact-row">
                    <div class="contact-form-field contact-col x-50">
                        <input id="name" class="contact-input-text js-input" type="text" required/>
                        <label class="contact-label" for="name">Name</label>
                    </div>
                    <div class="contact-form-field contact-col x-50">
                        <input id="email" class="contact-input-text js-input" type="email" required/>
                        <label class="contact-label" for="email">E-mail</label>
                    </div>
                    <div class="contact-form-field contact-col x-100">
                        <input id="message" class="contact-input-text js-input" type="text" required/>
                        <label class="contact-label" for="message">Message</label>
                    </div>
                    <div class="contact-form-field contact-col x-100 align-center">
                        <input class="contact-submit-btn" value="Send" type="submit" onClick={this.sendContactMail}/>
                    </div>
                </form>
            </section>
        </div>
        <div className="footer">
            <p>Made by Hugo Michard © 2021</p>
        </div>

    </div>
      </>
    );
  }
}
