vcnc-core is the portion of vcnc-rest that does not replicate at scale.
It is organized into independent services.

# Services
## vtrq polling

Polls the vtrq for storage efficiency stats.

## mock dashboard data

Simulates the *vda* / *vcnc-sampler* processes, using Gaussian random number
generators and writing mock data into RethinkDB.

# Implementation strategy

## Unified configuration

*vcnc-core* and *vcnc-rest* share a single configuration mechanism.

## Incremental migration

In the long term, *vcnc-rest* will be made as light as possible. Configuration
and libraries will move to *vcnc-core*. The *addon* will be hosted out of
*vcnc-rest* to be more explicitly shared with *vcnc-core*.

In the short term, and certainly before DAC, things that already exist in
*vcnc-rest* will remain there, and new things will live where similar things alreacy
live.
