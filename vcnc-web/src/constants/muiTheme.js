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
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
  teal500, green500, lightGreen500,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export const material_ui = {
  spacing: spacing,
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

const {primary1Color, textColor} = material_ui.palette;

export const vcnc = {
  palette: {
    vtrqColor: teal500,
    vpmColor: green500,
    vpColor: lightGreen500,
  },
  widgetFrame: {
    backgroundColor: fade(primary1Color, 0.3),
    titleColor: textColor,
    styles: {
      marginTop: '15px',
      marginBottom: '15px',
    }
  }

}