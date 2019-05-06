import {mount, shallow} from "enzyme";
import * as React from "react";
import {SyntheticEvent} from "react";
import FileReaderInput, {Result} from "react-file-reader-input";
import sinon from "sinon";
import {expect} from "../setupTests";
import {arbitrarySpeaker} from "../testSupport/arbitraryObjects";
import {Speaker} from "../types/types";
import {ImportMetildaTranscribe, ImportMetildaTranscribeProps} from "./ImportMetildaTranscribe";

describe("ImportMetildaTranscribe", () => {
    it("renders import input", () => {
        const subject = shallowRender({});
        expect(subject.find(".ImportMetildaTranscribe")).to.be.present();
        expect(subject.find(".ImportMetildaTranscribe-open")).to.be.present();
    });

    it("loads a file on click", () => {
        const mockSetSpeaker = sinon.stub();
        const subject = shallowRender({setSpeaker: mockSetSpeaker});
        const fileString = JSON.stringify(arbitrarySpeaker());
        const file = new Blob([fileString], {type: "text/plain"});
        const readAsText = sinon.stub();
        const addEventListener = sinon.stub().callsFake((_, evtHandler) => {
            evtHandler();
        });
        const dummyFileReader = {addEventListener, readAsText, result: fileString};
        // @ts-ignore
        window.FileReader = sinon.stub().returns(dummyFileReader);

        subject.find(FileReaderInput).simulate("change", {
            target: {
                files: [
                    file
                ]
            }
        });
        sinon.assert.calledOnce(mockSetSpeaker);
    });
});

interface OptionalProps {
    speakerIndex?: number;
    setSpeaker?: (speakerIndex: number, speaker: Speaker) => void;
    onImport?: (event: SyntheticEvent) => boolean;
}

function shallowRender(props: OptionalProps) {
    return shallow(<ImportMetildaTranscribe {...makeProps(props)}/>);
}

function makeProps(props: OptionalProps): ImportMetildaTranscribeProps {
    return {
        speakerIndex: props.speakerIndex || 0,
        setSpeaker: props.setSpeaker || fakeSetSpeaker,
        onImport: props.onImport || fakeOnImport
    };
}

function fakeSetSpeaker(speakerIndex: number, speaker: Speaker) {
    // do nothing
}

function fakeOnImport(event: SyntheticEvent): boolean {
    return false;
}
