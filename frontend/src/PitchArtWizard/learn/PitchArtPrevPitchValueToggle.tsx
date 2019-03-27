import * as React from "react";
import "../GlobalStyling.css";
import "./PitchArtPrevPitchValueToggle.css";
import {ChangeEvent} from "react";

interface Props {
    showPrevPitchValueLists: boolean,
    handleInputChange: (event: ChangeEvent) => void
}

class PitchArtPrevPitchValueToggle extends React.Component<Props> {
    render() {
        return (
            <div className="metilda-pitch-art-container-control-list-item">
                <div className="top-label">
                    <label>Show Previous Recordings</label>
                </div>
                <div className="switch">
                    <label>
                        No
                        <input type="checkbox"
                               checked={this.props.showPrevPitchValueLists}
                               onChange={this.props.handleInputChange}
                               name="showPrevPitchValueLists"/>
                        <span className="lever"></span>
                        Yes
                    </label>
                </div>
            </div>
        );
    }
}

export default PitchArtPrevPitchValueToggle;