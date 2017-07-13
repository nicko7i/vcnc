import argparse
import json
import os
from velstor.restapi.service import shutdown
from velstor.vclc.ns_copy import ns_copy
import velstor.restapi.grid as grid
import velstor.restapi.namespace as ns
import velstor.restapi.vp as vp
import velstor.restapi.workspace as ws
import logging


#  TODO: Fix this signature problem
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


def _value_configured(option, default=None):
    """ Returns the externally configured value of 'option' """
    #
    #  Currently we only look at environment variables.
    #
    root_env_name = 'VELSTOR_VCLC_' + option.upper()
    try:
        return os.environ[root_env_name]
    except:
        if default is None:
            return option
        return default

_epilog = """

ADDITIONAL HELP:

  Use [-h] or [--help] for additional help with a sub-command.

  Example:
    % vclc workspace --help

ENVIRONMENT VARIABLES:

  The default value of certain options may be changed using environment
  variables. Options specified on the command line have precedence over options
  specified in the environment.

  VELSTOR_VCLC_VTRQID sets the default for --vtrqid
  VELSTOR_VCLC_VCNC sets the default for --vcnc

  Example:
    % export VELSTOR_VCLC_VTRQID=89
    % export VELSTOR_VCLC_VCNC=coyote:80

EXIT CODE:

  vclc returns an exit code ( $? ) of 0 when the operation is successful; a
  value from errno.h otherwise.
"""


def _configure_grid(grid_subparsers, handler):
    #
    #  Grid Operations        ########################################
    #
    #  .. grid post job
    parser_grid_post = grid_subparsers.add_parser(
        'post',
        help='posts information about a grid job')
    parser_grid_post.add_argument(
        'jobid',
        help="ID of grid job")
    parser_grid_post.add_argument(
        'wkspc_name',
        help="Name of job's PeerCache workspace")
    parser_grid_post.set_defaults(
        action=handler.action,
        api_func=grid.post,
        api_args=['jobid', 'vtrqid', 'wkspc_name'])
    #
    #  .. grid get job
    parser_grid_get = grid_subparsers.add_parser(
        'get',
        help='retrieves information about a grid job')
    parser_grid_get.add_argument(
        'jobid',
        help="ID of grid job")
    #
    #  ... support legacy and new-style workspace specs
    parser_grid_get.set_defaults(
        action=handler.action
        , api_func=grid.get
        , api_args=['jobid'])
    #
    #  .. grid list job
    parser_grid_list = grid_subparsers.add_parser(
        'list',
        help='lists IDs of existing jobs')
    parser_grid_list.set_defaults(
        action=handler.action,
        api_func=grid.list,
        api_args=[],
        nargs=0)
    #
    #  .. grid delete job
    parser_grid_delete = grid_subparsers.add_parser(
        'delete',
        help='deletes information about a grid job')
    parser_grid_delete.add_argument(
        'jobid',
        help="ID of grid job")
    parser_grid_delete.set_defaults(
        action=handler.action,
        api_func=grid.delete,
        api_args=['jobid'])


#
#  VTRQ Operations        ########################################
#
def _configure_shutdown(parser_shutdown, handler):
    #  .. Shutdown
    parser_shutdown.set_defaults(
        action=handler.action,
        api_func=shutdown,
        api_args=['vtrqid'])


#
#  Namespace Operations  ########################################
#
def _configure_consistency(consistency_subparsers, handler):
    #  .. namespace consistency set
    parser_consistency_set = consistency_subparsers.add_parser(
        'set',
        help='set filesystem semantics')
    parser_consistency_set.add_argument(
        'type',
        choices=['immediate', 'eventual'],
        help="desired semantics for the sub-tree")
    parser_consistency_set.add_argument(
        'path',
        help="absolute path to the sub-tree")
    parser_consistency_set.set_defaults(
        action=handler.action,
        api_func=ns.consistency_set,
        api_args=['vtrqid', 'type', 'path'])
    #
    #  .. namespace consistency get
    parser_consistency_get = consistency_subparsers.add_parser(
        'get',
        help='get filesystem semantics')
    parser_consistency_get.add_argument(
        'path',
        help="absolute path to the sub-tree")
    parser_consistency_get.set_defaults(
        action=handler.action,
        api_func=ns.consistency_get,
        api_args=['vtrqid', 'path'])


def _configure_namespace(namespace_subparsers, handler):
    #
    #  .. namespace copy
    _ns_copy_epilog = """
Source and destination must both be files, or both be directories.
Directories are overwritten with 'cp -r' semantics.
"""
    parser_copy = namespace_subparsers.add_parser(
        'copy',
        aliases=['cp'],
        epilog=_ns_copy_epilog,
        help='meta-data copy')
    parser_copy.add_argument(
        'src',
        help="absolute path of the source file/directory")
    parser_copy.add_argument(
        'dest',
        help="absolute path of the destination file/directory")
    parser_copy.add_argument(
        '--overwrite',
        help="overwrites existing file/directory (default: False)",
        default=False,
        action='store_true')
    parser_copy.set_defaults(
        action=handler.action,
        api_func=ns_copy,
        api_args=['vtrqid', 'src', 'dest', 'overwrite'])
    #
    #  .. namespace delete
    parser_delete = namespace_subparsers.add_parser(
        'delete',
        aliases=['rm'],
        help='deletes a file or directory')
    parser_delete.add_argument(
        '-r', '--recursive',
        help='recursively delete directories.',
        action="store_true")
    parser_delete.add_argument(
        'path',
        help="absolute path to the file or directory")
    parser_delete.set_defaults(
        action=handler.action,
        api_func=ns.delete,
        api_args=['vtrqid', 'path', 'recursive'])
    #
    #  .. namespace list
    parser_list = namespace_subparsers.add_parser(
        'list',
        aliases=['ls'],
        help='lists a directory')
    parser_list.add_argument(
        'path',
        help="absolute path to the directory")
    parser_list.set_defaults(
        action=handler.action,
        api_func=ns.list,
        api_args=['vtrqid', 'path'])
    #
    #  .. namespace mkdir
    parser_mkdir = namespace_subparsers.add_parser(
        'mkdir',
        help='creates a directory')
    parser_mkdir.add_argument(
        '-p', '--parents',
        help='create intermediate directories as needed',
        action="store_true")
    parser_mkdir.add_argument(
        '-m', '--mode',
        help="permission bits",
        type=int,
        default=432)
    parser_mkdir.add_argument(
        'path',
        help="absolute path of directory to be created")
    parser_mkdir.set_defaults(
        action=handler.action,
        api_func=ns.mkdir,
        api_args=['vtrqid', 'mode', 'parents', 'path'])


def _configure_vp(vp_subparsers, handler):
    #
    # VP Operations  ########################################
    #
    #  .. vp get
    parser_vpget = vp_subparsers.add_parser(
        'get',
        help='retrieves information about a vp instance')
    parser_vpget.add_argument(
        'vpid',
        help="ID of vp instance")
    parser_vpget.set_defaults(
        action=handler.action,
        api_func=vp.get,
        api_args=['vtrqid', 'vpid'])
    #
    #  .. vp find
    parser_vpfind = vp_subparsers.add_parser(
        'find',
        help='finds vp instances')
    parser_vpfind.add_argument(
        '--vp_host',
        help="name of machine running the vp instance (default: any)",
        default=None)
    parser_vpfind.add_argument(
        '--mount_point',
        help="directory on which vp instance is mounted (default: any)",
        default=None)
    parser_vpfind.set_defaults(
        action=handler.action,
        api_func=vp.find,
        api_args=['vtrqid', 'vp_host', 'mount_point'])
    #
    #  .. vp delete
    parser_vpdelete = vp_subparsers.add_parser(
        'delete',
        help='disconnects a vp instance (future feature)')
    parser_vpdelete.add_argument(
        'vpid',
        help="ID of vp instance")
    parser_vpdelete.set_defaults(
        action=handler.action,
        api_func=vp.delete,
        api_args=['vtrqid', 'vpid'])


def _configure_workspace(workspace_subparsers, handler):
    api = ws
    wset_epilog = """
'writeback' can take the value 'always', 'trickle', 'explicit' or 'never'.

To specify a workspace on an interactive command line, put the JSON format
string between single quotes:

% vclc ws set /carol '{ "writeback": "never", "maps": [{"vp_path": "/", "vtrq_id": 10, "vtrq_path":  "/u/carol"}] }'

The same syntax works within a bash script:

File demo.sh:
#!/bin/bash
vclc ws set /carol '{ "writeback": "always", "maps": [{"vp_path": "/", "vtrq_id": 10, "vtrq_path":  "/u/carol"}] }'

% sh demo.sh
{"http_status": 200, "response": {"message": "Request processed.", "error_sym": "OK"}}

"""  # NOQA
    #
    #
    #  Workspace Operations  ########################################
    #
    #  .. workspace get
    parser_wget = workspace_subparsers.add_parser(
        'get',
        help='Retrieves a workspace specification')
    parser_wget.add_argument(
        'path',
        help="Name of workspace to retrieve")
    parser_wget.set_defaults(
        action=handler.action,
        api_func=api.get,
        api_args=['vtrqid', 'path'])
    #
    #  .. workspace list
    parser_wlist = workspace_subparsers.add_parser(
        'list',
        aliases=['ls'],
        help='Lists the workspaces and/or subdirectories at a path')
    parser_wlist.add_argument(
        'path',
        help="Absolute path to list")
    parser_wlist.set_defaults(
        action=handler.action,
        api_func=api.list,
        api_args=['vtrqid', 'path'])
    #
    #  .. workspace set
    parser_wset = workspace_subparsers.add_parser(
        'set',
        help='Uploads a workspace specification',
        epilog=wset_epilog,
        formatter_class=argparse.RawDescriptionHelpFormatter)

    parser_wset.add_argument(
        'path',
        help="Name of workspace being uploaded")
    parser_wset.add_argument(
        'spec',
        help="specification as JSON",
        nargs=argparse.REMAINDER)
    parser_wset.set_defaults(
        action=handler.action,
        api_func=api.set,
        api_args=['vtrqid', 'path', 'spec'])
    #
    #  .. workspace delete
    parser_wdelete = workspace_subparsers.add_parser(
        'delete',
        aliases=['rm'],
        help='Deletes a workspace specification')
    parser_wdelete.add_argument(
        'path',
        help="Name of workspace to be deleted")
    parser_wdelete.set_defaults(
        action=handler.action,
        api_func=api.delete,
        api_args=['vtrqid', 'path'])


def vclc_parser(handler):
    #
    #  Configure the top-level parser
    #
    parser = argparse.ArgumentParser(
        prog='vclc',
        epilog=_epilog,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        '--vcnc',
        help='host:port of the VelStor vcnc server. (default: vcnc:6130)',
        default=_value_configured('vcnc', 'vcnc:6130'))
    parser.add_argument(
        '--debug',
        help='logs HTTP activity to stderr',
        action=_EnableDebug,
        nargs=0,
        default=None)
    parser.add_argument(
        '--quiet', '-q',
        help='quashes all output, including errors',
        action='store_true',
        default=False,
        dest='quiet')
    parser.add_argument(
        '--json',
        help='formats output as JSON',
        action='store_true',
        default=_value_configured('json', 'false'))
    parser.add_argument(
        '--vtrqid',
        type=int,
        help='ID of the vtrq to contact. (default: 0)',
        default=_value_configured('vtrqid', 0))
    parser.add_argument(
        '--version',
        help='prints the vclc version to stdout',
        action='version',
        version=_version())
    #
    #  Define the sub-commands
    #
    subparsers = parser.add_subparsers(help='available commands')
    # .. grid
    parser_grid = subparsers.add_parser(
        'grid',
        help='manage grid operations')
    grid_subparsers = parser_grid.add_subparsers(
        help='grid commands')
    # .. namespace
    parser_namespace = subparsers.add_parser(
        'namespace',
        aliases=['ns'],
        help='manage namespace')
    namespace_subparsers = parser_namespace.add_subparsers(
        help='namespace commands')
    #
    # .. vp management
    parser_vp = subparsers.add_parser(
        'vp',
        help='manage vp instances')
    vp_subparsers = parser_vp.add_subparsers(
        help='vp management commands')
    # .. workspace
    parser_workspace = subparsers.add_parser(
        'workspace',
        aliases=['ws'],
        help='manage workspaces')
    workspace_subparsers = parser_workspace.add_subparsers(
        help='workspace commands')
    # .. shutdown
    parser_shutdown = subparsers.add_parser(
        'shutdown',
        help='shutdown vtrq')

    #
    #  Configure the subcommands
    #
    _configure_grid(grid_subparsers, handler)
    _configure_namespace(namespace_subparsers, handler)
    _configure_consistency(consistency_subparsers, handler)
    _configure_vp(vp_subparsers, handler)
    _configure_workspace(workspace_subparsers, handler)
    _configure_shutdown(parser_shutdown, handler)

    return parser
