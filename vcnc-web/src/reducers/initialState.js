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
    storageEfficiencyTrend: [1],
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
};
