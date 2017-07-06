import string
import random
import subprocess
import json
import os
import errno
from velstor.pcapi.volume import Volume
from velstor.pcapi.workspace import Workspace


class VclcError(Exception):
    """
    Error information for an invocation of 'vclc'
    
    Contains everything a CalledProcessError has, plus the HTTP
    error code, the vtrq 'error_sym', and the vtrq 'message'
    (as 'msg')
    """
    def __init__(self, returncode, cmd, output):
        message = "Command '{}' returned non-zero exit status '{}'"
        super(VclcError, self).__init__(message)
        self.returncode = returncode
        self.cmd = cmd
        self.output = output
        self.error_sym = None
        try:
            body = json.loads(output)
            self.error_sym = body['response']['error_sym']
            self.msg = body['response']['message']
            self.http_status = body['http_status']
        except ValueError:
            # JSON decode failed.
            pass
        except KeyError:
            # One or more of the expected keys was not found.
            pass

    def __str__(self):
        return "Command '{}' returned non-zero exit status {} with output '{}'".format(
            self.cmd, self.returncode, self.output)


config = {
    'vcnc': 'cnc:7130',
    'vp_mount_root': '/tmp/vcnc/stress/',
    'vpm': 'cnc,7110,tcp4',
    'vtrq': 'trq,7100,tcp4',
    'vtrqid': 0
}


def command(*args):
    """Runs a command in a subprocess"""
    print('command: Invoking ', ' '.join(args))
    rtn = subprocess.check_output(args).decode('utf-8')
    print(rtn)


def vclc(*args):
    """Invokes a vclc command and returns the results as a dictionary.
    
    Raises VclcError when the process exit code is non-zero.
    """
    #
    # Form the command
    #
    cmd = ['./bin/vclc',
           '--vcnc=' + config['vcnc'],
           '--vtrqid=' + str(config['vtrqid'])] + list(args)
    print('vclc: invoking:', ' '.join(cmd))
    try:
        doc = subprocess.check_output(cmd).decode('utf-8')
    except subprocess.CalledProcessError as e:
        raise VclcError(e.returncode, e.cmd, e.output.decode('utf8'))
    try:
        rtn = json.loads(doc)
        rtn['returncode'] = 0
        print(rtn)
        return rtn
    except ValueError:
        raise VclcError(0, cmd, doc)


def create_workspace(**kwargs):
    """Creates a workspace specification as a Python data structure"""
    vtrq_id = int(kwargs['vtrq_id'] if 'vtrq_id' in kwargs else '0')
    vtrq_path = kwargs['vtrq_path'] if 'vtrq_path' in kwargs else '/'
    writeback = kwargs['writeback'] if 'writeback' in kwargs else 'always'
    return {'writeback': writeback,
            'maps': [{'vp_path': '/', 'vtrq_id': vtrq_id, 'vtrq_path': vtrq_path}]}


def create_workspace_vtrq(path, spec):
    """Creates a workspace specification on the vtrq
    
    Accepts a JSON string or a python data structure as the spec.
    """
    json_spec = spec if type(spec) is str else json.dumps(spec)
    #
    #  Clear out any existing spec
    #
    vclc('ws', 'rm', path)
    #
    #  Post the new spec
    #
    result = vclc('ws', 'set', path, json_spec)
    return result['http_status']


def delete_workspace_vtrq(path):
    """Deletes a workspace specification on the vtrq.
    
    Returns the HTTP status coce.
    """
    result = vclc('ws', 'rm', path)
    return result['http_status']


def mount_vp(path, workspace_pathname, **kwargs):
    """Mounts a VP using 'workspace_pathname' on 'path'
    
    Assumes the appropriate vp is on the system path."""
    #
    is_private = kwargs['is_private'] if 'is_private' in kwargs else False
    #
    #  Create the mount directory on 'path'
    #
    os.makedirs(path, exist_ok=True)
    #
    #  Ensure the vtrq_path exists.
    #
    workspace = vclc('ws', 'get', workspace_pathname)
    print(workspace)
    try:
        vclc('ns', 'mkdir', '-p', workspace['response']['spec']['maps'][0]['vtrq_path'])
    except VclcError as e:
        print('Return code is: {}'.format(e.returncode))
        if e.returncode != errno.EEXIST:
            raise
    #
    #  Invoke the VP
    cmd = ['vp',
           '--mount=' + path,
           '--mentor=' + config['vpm'],
           '--workspace=' + workspace_pathname]
    if is_private:
        cmd = cmd + ['--fuse-cache=none', '--timeout=0']
    print('mount_vp: invoking:', ' '.join(cmd))
    rtn = subprocess.check_output(cmd).decode('utf-8')
    print(rtn)
    return rtn


def unmount_vp(path):
    """Unmounts the VP on 'path'"""
    cmd = ['fusermount', '-uz', path]
    print('unmount_vp: invoking:', ' '.join(cmd))
    rtn = subprocess.check_output(cmd).decode('utf-8')
    print(rtn)
    return rtn


def random_identifier(length):
    return ''.join(random.choice(
        string.ascii_letters + '_' + string.digits
    ) for i in range(length))


def random_path(length, depth, prefix='/'):
    return prefix + '/'.join(random_identifier(length) for i in range(depth))


def create_workspace_legacy(local):
    """Returns a single legacy workspace specification.
    """
    return [{
        'local': local,
        'vp_path': '/',
        'vtrq_id': 0,
        'vtrq_path': '/u/bubba',
    }]


class Mount:
    """A 'Mount' is the unholy conjunction of a Volume and a Workspace"""
    def __init__(self, session, mount_point, **kwargs):
        self._workspace = Workspace(session, **kwargs)
        self.volume = Volume(session, mount_point, self.workspace)
        self.workspace.set(hard=True)
        self.volume.mount(hard=True)

    def dispose(self):
        self.volume.unmount()
        self.workspace.delete(hard=True)

    @property
    def mount_point(self):
        return self.volume.mount_point

    @property
    def workspace(self):
        return self._workspace

    @property
    def vtrq_id(self):
        return self.workspace.vtrq_id

    @property
    def vtrq_path(self):
        return self.workspace.vtrq_path

    @property
    def writeback(self):
        return self.workspace.writeback

    @property
    def pathname(self):
        return self.workspace.pathname

    @property
    def is_private(self):
        return self.workspace.writeback != 'always'
