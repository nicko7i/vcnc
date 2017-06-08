//
//  vcnc theming is piggybacked on material-ui's theming mechanism.  See
//  http://www.material-ui.com/#/customization/themes
//
//  I'm intentionally not distinguishing between material-ui stuff and vcnc
//  stuff.  It will be clear enough in the code, and the possibility of
//  collisions is low.
//

import {
  cyan500, cyan700,
  grey800,
  pinkA200,
  red500,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
  blue500, lightBlue500,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

const materialUi = {
  spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    // material-ui...
    primary1Color: cyan500,
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
};

const { primary1Color, textColor } = materialUi.palette;

export const vcnc = {
  palette: {
    emptyDoughnutColor: grey400,
    storageEfficiencyColor: grey800,
    sumExtentsColor: red500,
    sumStSizeColor: blue500,
    vtrqColor: blue500,
    vpmColor: red500,
    vpColor: lightBlue500,
  },
  widgetFrame: {
    backgroundColor: fade(primary1Color, 0.3),
    titleColor: textColor,
    styles: {
      marginTop: '15px',
      marginBottom: '15px',
    },
  },
  dashboard: {
    canvasHeight: '35vh',
  },
};

export default materialUi;
