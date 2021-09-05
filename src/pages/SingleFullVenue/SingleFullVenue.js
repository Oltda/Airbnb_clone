import React, {Component} from 'react';
import './SingleFullVenue.css';
import axios from 'axios';
import Point from './Point'
import {connect} from 'react-redux';
import openModal from '../../actions/openModal';
import {bindActionCreators} from 'redux';
import Login from '../Login/Login';
import moment from 'moment';
import swal from 'sweetalert';
import loadScript from '../../utilityFunctions/loadScript';

class SingleFullVenue extends Component{

        state = {
            singleVenue: {},
            points: [],
            checkIn: "",
            checkOut: ""
        }

        async componentDidMount(){
            const vId = this.props.match.params.vid;
            const url = `${window.apiHost}/venue/${vId}`;
            const axiosResponse = await axios.get(url);
            const singleVenue = axiosResponse.data;


            const pointsUrl = `${window.apiHost}/points/get`;
            const pointsAxiosResponse =await axios.get(pointsUrl);

            const points = singleVenue.points.split(',').map((point, i)=>{
                return(<Point key={i} pointDesc={pointsAxiosResponse.data} point={point} />)
            })

            this.setState({singleVenue, points});           
        }

        changeNumberOfGuests = (e)=>{this.setState({numberOfGuests: e.target.value})}
        changeCheckIn = (e)=>{this.setState({checkIn: e.target.value})}
        changeCheckOut = (e)=>{this.setState({checkOut: e.target.value})}


        reserveNow = async(e) =>{
          
            const startDayMoment = moment(this.state.checkIn)
            const endDayMoment = moment(this.state.checkOut)
            const diffDays = endDayMoment.diff(startDayMoment, "days");
            if(diffDays < 1){
                swal({
                    title: "Checkout date must be after check in date",
                    icon: "error",
                })
            }else if(isNaN(diffDays)){
                swal({
                    title: "Bad date, make sure your dates are valid",
                    icon: "error",
                })
            }else{
                const pricePerNight = this.state.singleVenue.pricePerNight
                const totalPrice = pricePerNight * diffDays;
              
                const stripePublicKey = 'pk_test_5198HtPL5CfCPYJ3X8TTrO06ChWxotTw6Sm2el4WkYdrfN5Rh7vEuVguXyPrTezvm3ntblRX8TpjAHeMQfHkEpTA600waD2fMrT';
                const scriptUrl = 'https://js.stripe.com/v3'
    

                await loadScript(scriptUrl)
                const stripe = window.Stripe(stripePublicKey)
                const stripeSessionUrl = `${window.apiHost}/payment/create-session`;
                const data = {
                    venueData: this.state.singleVenue,
                    totalPrice,
                    diffDays,
                    pricePerNight,
                    checkIn:this.state.checkIn,
                    checkOut:this.state.checkOut,
                    token: this.props.auth.token,
                    currency: 'USD'
                }
                const sessionVar = await axios.post(stripeSessionUrl, data)
                stripe.redirectToCheckout({
                    sessionId:sessionVar.data.id,
                }).then((result)=>{
                    console.log(result)
                })
            }
        }


        render(){

            const sv = this.state.singleVenue
            return(
                <div className="row single-venue">
                    <div className="col s12 center">
                        <img src={sv.imageUrl} />
                    </div>
                    <div className="col s8 location-details offset-s2">
                        <div className="col s8 left-details">
                            <div className="location">{sv.location}</div>
                            <div className="title">{sv.title}</div>
                            <div className="guests">{sv.guests}</div>

                            <div className="divider"></div>

                            {this.state.points}

                            <div className="details">{sv.details}</div>
                            <div className="amenities">{sv.amenities}</div>
                        </div>
                        <div className="col s4 right-details">
                                <div className="price-per-day">${sv.pricePerNight} <span>per day</span> </div>
                                <div className="rating">{sv.rating}</div>
                                <div className="col s6">
                                    Check-In
                                    <input onChange={this.changeCheckIn} type="date" />
                                </div>
                                <div className="col s6">
                                    Check-Out
                                    <input onChange={this.changeCheckOut} type="date" />
                                </div>

                                <div>
                                    <select onChange={this.changeNumberOfGuests} className="browser-default">
                                        <option value="1">1 Guest</option>
                                        <option value="2">2 Guest</option>
                                        <option value="3">3 Guest</option>
                                        <option value="4">4 Guest</option>
                                        <option value="5">5 Guest</option>
                                        <option value="6">6 Guest</option>
                                        <option value="7">7 Guest</option>
                                        <option value="8">8 Guest</option>
                                    </select>
                                </div>
                                <div className="col s12 center">
                                    {this.props.auth.token ?
                                        <button onClick={this.reserveNow} className="btn">Reserve</button>
                                    :<div>You Must <span className="text-link" onClick={()=>{this.props.openModal('open', <Login />)}}>Log in</span> in to reserve</div>
                                    }

                                </div>

                        </div>


                    </div>
                </div>
            )

        }
}


function mapStateToProps(state){
    return{
        auth:state.auth
    }
}

function mapDispatchToProps(dispatcher){
    return bindActionCreators({
        openModal
    }, dispatcher)
}


export default connect(mapStateToProps, mapDispatchToProps)(SingleFullVenue);
