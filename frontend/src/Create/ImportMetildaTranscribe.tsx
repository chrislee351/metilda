import * as React from "react";
import {SyntheticEvent} from "react";
import FileReaderInput, {Result} from "react-file-reader-input";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router-dom";
import {ThunkDispatch} from "redux-thunk";
import "../PitchArtWizard/GlobalStyling.css";
import {setLetterPitch, setSpeaker} from "../store/audio/actions";
import {AudioAction} from "../store/audio/types";
import {AppState} from "../store/index";
import {Speaker} from "../types/types";
import "./CreatePitchArt.css";
import "./ImportMetildaTranscribe.css";

export interface ImportMetildaTranscribeProps {
    speakerIndex: number;
    setSpeaker: (speakerIndex: number, speaker: Speaker) => void;
    onImport: (event: SyntheticEvent) => boolean;
}

export class ImportMetildaTranscribe extends React.Component<ImportMetildaTranscribeProps> {
    fileSelected = (event: React.ChangeEvent<HTMLInputElement>, results: Result[]) => {
        if (event.target.files && event.target.files.length === 1) {
            const file: File = event.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("loadend", () => {
                const speakerString = JSON.parse(reader.result as string);
                const speaker: Speaker = speakerString as Speaker;
                this.props.setSpeaker(this.props.speakerIndex, speaker);
            });
            reader.readAsText(file);
        }
    }

    render() {
        return (
            <div className="ImportMetildaTranscribe">
                <FileReaderInput as="binary" onChange={this.fileSelected}>
                    <button onClick={this.props.onImport}
                            className="ImportMetildaTranscribe-open waves-effect waves-light btn">
                        Open
                    </button>
                </FileReaderInput>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    speakers: state.audio.speakers
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, AudioAction>) => ({
    setSpeaker: (speakerIndex: number, speaker: Speaker) => dispatch(setSpeaker(speakerIndex, speaker))
});

export default connect(mapStateToProps, mapDispatchToProps)(ImportMetildaTranscribe);
