import {green, red, yellow} from "@mui/material/colors";
import {decomposeColor} from "@mui/system/colorManipulator";

export default function colorGradient(fade: number): string {
    const color1 = decomposeColor(fade >= 0.5 ? yellow[500] : green[500]);
    const color2 = decomposeColor(fade >= 0.5 ? red[500] : yellow[500]);
    fade = 2 * (fade >= 0.5 ? fade - 0.5 : fade);
    const [r, g, b] = color1.values.map((value, index) => Math.floor(value + (color2.values[index] - value) * fade));
    return `rgb(${r}, ${g}, ${b})`;
}
