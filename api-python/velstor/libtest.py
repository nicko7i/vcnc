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
    
    Args:
        returncode: The Linux process exit code.
        cmd (:obj:`list` of :obj:`str`): The command invoked.
        output (str): Contents of stdout.
        
    Attributes:
        returncode (int): The Linux process exit code.
        cmd (:obj:`list` of :obj:`str`): The command invoked.
        output (str): Contents of stdout.
        error_sym (str): Status of REST operation.
        msg (str): Message from REST operation.
        http_status (int): HTTP status code from REST operation.
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
    """
    Runs a Linux command in a subprocess.
    
    Args:
        *args: Tokens passed to 'exec'.

    Raises:
        subprocess.CalledProcessError: Throw on non-zero Linux exit code.
    """
    print('command: Invoking ', ' '.join(args))
    rtn = subprocess.check_output(args).decode('utf-8')
    print(rtn)


def vclc(*args):
    """
    Runs the 'vclc' as if on the command line.
    
    Args:
        *args: Command-line arguments to 'vclc'.

    Returns:
        dict: The JSON response from the REST server, with the additional key 'returncode', whose value is the vclc process exit code.
            
    Raises:
        VclcError: Process exit code is non-zero or REST response not valid JSON.
    """
    # dict: The JSON response from the REST server, with the additional
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
    """
    Creates a workspace specification as a Python data structure.
    
    Args:
        **kwargs:  Optional keyword arguments.
        
    Keyword Args:
        vtrq_id (int): vtrq ID.  Default is 0.
        vtrq_path (str): Absolute vtrq path mapped to mount point. Default is '/'.
        writeback (str): Writeback semantics.  One of 'always', 'explicit',
            'trickle' or 'never'.  Default is 'always'.

    Returns:
        (dict): A workspace specification.
        
    Note:
        Can only create specifications having a single map entry.
    """
    vtrq_id = int(kwargs['vtrq_id'] if 'vtrq_id' in kwargs else '0')
    vtrq_path = kwargs['vtrq_path'] if 'vtrq_path' in kwargs else '/'
    writeback = kwargs['writeback'] if 'writeback' in kwargs else 'always'
    return {'writeback': writeback,
            'maps': [{'vp_path': '/', 'vtrq_id': vtrq_id, 'vtrq_path': vtrq_path}]}


def create_workspace_vtrq(path, spec):
    """
    Creates a workspace specification on the vtrq.
    
    Args:
        path (str): The hierarchical name of the workspace.
        spec (str or dict): The workspace specification.

    Returns:
        int: The HTTP status code.
        
    Raises:
        VclcError:
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
    """
    Deletes a workspace specification on the vtrq.
    
    Args:
        path: The hierarchical name of the workspace.

    Returns:
        int: The HTTP status code.
        
    Raises:
        VclcError: Problem creating directory on vtrq.
        subprocess.CalledProcessError: Problem with vclc invocation.
    """
    result = vclc('ws', 'rm', path)
    return result['http_status']


def mount_vp(path, workspace_pathname, **kwargs):
    """
    Mounts a VP using 'workspace_pathname' on 'path'
    
    Args:
        path: The local filesystem directory on which the VP mounts.
        workspace_pathname: The hierarchical name of the workspace.
        **kwargs: Optional keyword arguments.

    Keyword Args:
        is_private (bool): False if 'writeback' is 'always', True otherwise.
        
    Returns:
        (str): The stdout of the call to 'vp'.
        
    Notes:
        Assumes the appropriate vp is on the system PATH.
        
        TODO: Compute 'is_private' automatically.
    """
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
        cmd = cmd + ['--fuse-cache=auto', '--timeout=1']
    else:
        cmd = cmd + ['--fuse-cache=none', '--timeout=0']
    print('mount_vp: invoking:', ' '.join(cmd))
    rtn = subprocess.check_output(cmd).decode('utf-8')
    print(rtn)
    return rtn


def unmount_vp(path):
    """
    Unmounts the VP on 'path'
    """
    cmd = ['fusermount', '-uz', path]
    print('unmount_vp: invoking:', ' '.join(cmd))
    rtn = subprocess.check_output(cmd).decode('utf-8')
    print(rtn)
    return rtn


def random_identifier(length):
    """
    Returns a random identifier.
    
    Args:
        length (int): number of characters to generate.

    Returns:
        str: A randomly generated identifier.
    """
    return ''.join(random.choice(
        string.ascii_letters + '_' + string.digits
    ) for i in range(length))


def random_path(length, depth, prefix="/"):
    """
    Returns a random absolute path.
    
    Args:
        length (int): number of characters in each name.
        depth (int): number of names in the path.
        prefix (str): Prefix to path. Default is "/".

    Returns:
        str: A randomly generated path.

    """
    return prefix + '/'.join(random_identifier(length) for i in range(depth))


class Mount:
    """
    The unholy conjunction of a Volume and a Workspace.
    
    Reduces boilerplate when mounting VPs on short-lived workspaces.
    
    Args:
        session: Security information.
        mount_point: The local directory where the VP will mount.
        **kwargs: Optional arguments passed to :class:`Workspace`.
        
    The constructor creates the specified workspace, puts it on the vtrq,
    and mounts the VP.
    
    Calling dispose un-mounts the vp and removes the workspace
    from the vtrq.
    """
    def __init__(self, session, mount_point, **kwargs):
        self._workspace = Workspace(session, **kwargs)
        self.volume = Volume(session, mount_point, self.workspace)
        self.workspace.set(hard=True)
        self.volume.mount(hard=True)

    def dispose(self):
        """
        Unmounts the :class:`Volume` and deletes the :class:`Workspace`
        on the vtrq.
        """
        self.volume.unmount()
        self.workspace.delete(hard=True)

    @property
    def mount_point(self):
        """str: Directory on which VP will be mounted."""
        return self.volume.mount_point

    @property
    def workspace(self):
        """Workspace: the Workspace component of this instance."""
        return self._workspace

    @property
    def vtrq_id(self):
        """int: Identifer of vtrq."""
        return self.workspace.vtrq_id

    @property
    def vtrq_path(self):
        """str: Absolute vtrq path mapped by this workspace."""
        return self.workspace.vtrq_path

    @property
    def writeback(self):
        """str:  Writeback value."""
        return self.workspace.writeback

    @property
    def pathname(self):
        """str:  Hierarchical workspace name."""
        return self.workspace.pathname

    @property
    def is_private(self):
        """bool: True if this workspace is 'private', False otherwise."""
        return self.workspace.writeback != 'always'
