#
#  
import argparse
import os
import velstor.restapi.workspace as ws
import velstor.restapi.grid as grid
import json

import logging


class _EnableDebug(argparse.Action):
    def __call__(self, parser, namespace, values, option_string):
        logging.basicConfig()
        logging.getLogger().setLevel(logging.DEBUG)
        requests_log = logging.getLogger("requests.packages.urllib3")
        requests_log.setLevel(logging.DEBUG)
        requests_log.propagate = True


def _version():
    filename = 'share/vclc/version.json'
    if not os.path.isfile(filename):
        filename = 'version.json'
    with open(filename, 'r') as jfile:
        j = json.load(jfile)
        #  Intentionally matches Pepsis --version output.
        return ' '.join(['vclc Version', j['version'], 'Build', j['build']])


def _value_configured(env_name, default):
    """ Returns the externally configured value of 'option' """
    #
    #  Currently we only look at environment variables.
    #
    try:
        return os.environ[env_name]
    except:
        return default

_epilog = """

ENVIRONMENT VARIABLES:

  The default value of certain options may be changed using environment
  variables. Options specified on the command line have precedence over options
  specified in the environment.

  VELSTOR_VCLC_VTRQID sets the default for --vtrqid
  VELSTOR_VCLC_VCNC sets the default for --vcnc
  VELSTOR_VSH_MENTOR sets the default for --vpm
  VELSTOR_VSH_MOUNT sets the default for --mount

  Example:
    % export VELSTOR_VCLC_VTRQID=89
    % export VELSTOR_VCLC_VCNC=coyote:80
    % export VELSTOR_VSH_MENTOR=/tmp/vpm.socket
    % export VELSTOR_VSH_MOUNT=/path/to/mount/point
    % vsh job-id-42 --vpm=/tmp/other/socket

  Note that the job id must come /before/ the options, and that the 
  option name and value are separated by '='.

EXIT CODE:

  vsh returns an exit code ( $? ) of 0 when the operation is successful; a
  value from errno.h otherwise.
"""


def vsh_parser():
    #
    #  Configure the top-level parser
    #
    parser = argparse.ArgumentParser(
        prog='vsh'
        , epilog=_epilog
        , formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        '--mount'
        , help="mount point for the job's file system. (default: /tmp/velstor/jobid)"
        , default=_value_configured('VELSTOR_VSH_MOUNT', None))
    parser.add_argument(
        '--vcnc'
        , help='host:port of the VelStor vcnc server. (default: vcnc:6130)'
        , default=_value_configured('VELSTOR_VCLC_VCNC', 'vcnc:6130'))
    parser.add_argument(
        '--vpm'
        , help='host:port of the VelStor vpm. (default: /tmp/velstor/vpm.socket)'
        , default=_value_configured('VELSTOR_VSH_MENTOR'
                                    , '/tmp/velstor/vpm.socket'))
    #parser.add_argument(
    #    '--debug'
    #    , help='logs HTTP activity to stderr'
    #    , action=_EnableDebug
    #    , nargs=0
    #    , default=None)
    parser.add_argument(
        '--vtrqid'
        , type=int
        , help='ID of the vtracker to contact. (default: 0)'
        , default=_value_configured('VELSTOR_VCLC_VTRQ', 0))
    parser.add_argument(
        '--version'
        , help='prints the vsh version to stdout'
        , action='version'
        , version=_version())
    parser.add_argument(
        'jobid'
        , help='job identifier')
        
    return parser
