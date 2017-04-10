vcnc-core is the portion of vcnc-rest that does not replicate at scale.
It is organized into independent services.

## vtrq polling

Polls the vtrq for storage efficiency stats.

## mock dashboard data

Simulates the *vda* / *vcnc-sampler* processes, using Gaussian random number
generators and writing mock data into RethinkDB.
