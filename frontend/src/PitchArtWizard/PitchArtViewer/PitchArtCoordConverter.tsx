import {exponentToNote, referenceExponent} from "./PitchArtScale";
import {PitchArtWindowConfig, RawPitchValue} from "./types";

class PitchArtCoordConverter {
    private config: PitchArtWindowConfig;
    private pitchValues?: RawPitchValue[];
    private readonly vertOffset: number;
    private isTimeNormalized: boolean;

    constructor(config: PitchArtWindowConfig,
                pitchValues?: RawPitchValue[],
                isVerticallyCentered?: boolean,
                isTimeNormalized?: boolean) {
        this.config = config;
        this.pitchValues = pitchValues;
        this.vertOffset = 0.0;
        this.isTimeNormalized = isTimeNormalized || false;

        if (isVerticallyCentered && pitchValues) {
            this.vertOffset = this.centerOffset(
                pitchValues.map((item) => this.vertValueToRectCoords(item.pitch))
            );
        }
    }

    horzIndexToRectCoords(time: number) {
        if (!this.pitchValues) {
            throw new Error("Unsupported operation, pitchValues is not provided");
        }

        let timePerc;

        if (this.pitchValues.length === 1) {
            timePerc = 0.0;
        } else if (this.isTimeNormalized) {
            const timeIndex = this.pitchValues.map((item) => item.t0).indexOf(time);
            timePerc = timeIndex / (this.pitchValues.length - 1);
        } else {
            const totalDuration = this.pitchValues[this.pitchValues.length - 1].t0 - this.pitchValues[0].t0;
            timePerc = (time - this.pitchValues[0].t0) / totalDuration;
        }

        const pointDx = timePerc * this.config.innerWidth;
        return this.config.x0 + pointDx;
    }

    vertValueToRectCoords(pitch: number) {
        const refExp = referenceExponent(pitch);
        const pitchIntervalSteps = referenceExponent(this.config.dMax) - referenceExponent(this.config.dMin);
        const valuePerc = (refExp - referenceExponent(this.config.dMin)) / pitchIntervalSteps;
        const rectHeight = this.config.innerHeight * valuePerc;
        return this.config.innerHeight - rectHeight + this.config.y0 - this.vertOffset;
    }

    rectCoordsToVertValue(rectCoord: number) {
        let rectCoordPerc = (rectCoord - this.config.y0) / (this.config.innerHeight - this.config.y0);
        rectCoordPerc = Math.min(rectCoordPerc, 1.0);
        rectCoordPerc = Math.max(rectCoordPerc, 0.0);
        rectCoordPerc = 1.0 - rectCoordPerc; // invert so 0.0 is lowest frequency and 1.0 is highest frequency

        // Convert the rectangular coordinate to the appropriate "step" along the perceptual scale
        const pitchIntervalSteps = referenceExponent(this.config.dMax) - referenceExponent(this.config.dMin);
        const rectCoordStepOffset = Math.round(pitchIntervalSteps * rectCoordPerc);
        let rectCoordPitch = exponentToNote(referenceExponent(this.config.dMin) + rectCoordStepOffset);

        rectCoordPitch = Math.min(rectCoordPitch, this.config.dMax);
        rectCoordPitch = Math.max(rectCoordPitch, this.config.dMin);
        return rectCoordPitch;
    }

    private centerOffset(pitches: number[]) {
        if (pitches.length < 1) {
            return 0.0;
        }

        const figureHeight = Math.max(...pitches) - Math.min(...pitches);
        const figureCenterY = Math.min(...pitches) + (figureHeight / 2.0);
        const windowCenterY = this.config.y0 + (this.config.innerHeight / 2.0);

        return figureCenterY - windowCenterY;
    }

}

export default PitchArtCoordConverter;
