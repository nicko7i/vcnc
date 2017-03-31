import * as color from '../constants/colorNames';
//
//  One key per reducer.
//
export default {
  app: {
    navDrawerOpen: false,
  },
  realtime: {
    //
    //  PeerCache performance
    //
    storageEfficiency: 1,
    //
    //  PeerCache "caching" performance
    //  ... Aggregate numbers over all vps and vpms
    rVtrq: 0, // read rate (kB/sec) at vTrq
    rVpm: 0, // read rate (kB/sec) resolved at vPM, over all vPMs
    rVp: 0, // read rate (kB/sec) resolved at VP, over all VPs
    rVtrqTrend: [],
    rVpmTrend: [],
    rVpTrend: [],
    //
    //  Zero Time Sync performance
    //  ... files synced per time period
    ztsColdFiles: 0,
    ztsWarmFiles: 0,
    ztsHotFiles: 0,
    ztsColdFilesTrend: [],
    ztsWarmFilesTrend: [],
    ztsHotFilesTrend: [],
    //  ... k-bytes synced per time period
    ztsColdKB: 0,
    ztsWarmKB: 0,
    ztsHotKB: 0,
    ztsColdKBTrend: [],
    ztsWarmKBTrend: [],
    ztsHotKBTrend: [],

  },
  settings: {
    currentVcnc: 'localhost:1630',
    currentVtrq: 0,
  },
  theme: {
    //
    //  Associate a consistent color with certain entities and concepts.
    //  These values need to be passed as props to dashboard widgets.  CSS
    //  is not an alternative.
    //
    colorCold: color.Peterriver,
    colorWarm: color.Orange,
    colorHot: color.Alizarin,
    //
    //
    colorVtrq: color.Silver,
    colorVpm: color.Peterriver,
    colorVp: color.mTeal,
    colorZTS: color.Amethyst,  // zero-time sync
  },
};
