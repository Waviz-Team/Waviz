import React from "react";
type vizComponentProps = {
    srcAudio: any;
    srcCanvas: React.RefObject<HTMLCanvasElement>;
    options: {};
};
declare function WaveComponent({ srcAudio, srcCanvas, options }: vizComponentProps): import("react/jsx-runtime").JSX.Element;
export default WaveComponent;
