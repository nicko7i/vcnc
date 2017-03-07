import getMuiTheme from 'material-ui/styles/getMuiTheme';

//
//  One key per reducer.
//
export default {
  app: {
    muiTheme: getMuiTheme(),
    navDrawerOpen: false,
  },
  fuelSavings: {
    newMpg: '',
    tradeMpg: '',
    newPpg: '',
    tradePpg: '',
    milesDriven: '',
    milesDrivenTimeframe: 'week',
    displayResults: false,
    dateModified: null,
    necessaryDataIsProvidedToCalculateSavings: false,
    savings: {
      monthly: 0,
      annual: 0,
      threeYear: 0
    }
  },
};
