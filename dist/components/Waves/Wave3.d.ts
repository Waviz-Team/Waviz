import React from "react";
type vizComponentProps = {
    srcAudio: any;
    srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
    options?: {};
    audioContext?: AudioContext;
};
declare function Wave3({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps): import("react/jsx-runtime").JSX.Element;
export default Wave3;
