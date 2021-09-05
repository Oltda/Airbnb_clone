import React, {Component} from 'react';
import './Activity.css';
import Activity from './Activity';
import SlickSlider from '../Slider/Slider';

class Activities extends Component{
    render(){


        const activities = this.props.activities.map((activity, i)=>{
            return(
                <div key={i} className="col s3"> 
                    <Activity activity={activity} />
                </div>
            )
        })
        return(
            <div className="activities">
                <h1 className="main-header-text">{this.props.header}</h1>
                <SlickSlider elements={activities} />
                
            </div>

        )
    }
}

export default Activities;