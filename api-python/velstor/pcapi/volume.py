import os.path
import subprocess
from velstor.restapi import namespace
from velstor.pcapi.exceptions import RESTException


class Volume:
    """
    Represents a VP mounted on the local filesystem.
    """
    def __init__(self, session, mount_point, workspace):
        """
        Uploads the workspace to the vtrq and mounts a VP.

        Args:
            session: The REST API session state.
            mount_point: The local directory on which the VP is mounted.
            workspace: The workspace used by the VP.
        """
        self._session = session
        self._mount_point = os.path.abspath(mount_point)
        self._workspace = workspace

    def mount(self, **kwargs):
        """
        Mounts a VP on the local filesystem.

        Args:
            **kwargs: Keyword arguments.

        Raises:
            ValueError:
            RESTException:
            CheckedOutputException:
        """
        if self._workspace.pathname is None:
            raise ValueError('Workspace has no pathname')
        hard = kwargs['hard'] if 'hard' in kwargs else False
        #
        #  Create the vtrq_path if it doesn't already exist
        #
        try:
            namespace.mkdir(
                self._session,
                self.workspace.vtrq_id,
                0o777,
                True,  # Create parents
                self.mount_point
            )
        except RESTException as e:
            #  We don't care if it already exists
            if hard and e.error_sym != 'EEXIST':
                raise e
        #
        #  Ensure the workspace is on the vtrq
        #
        self.workspace.set(hard=hard)
        #
        #  Run the VP in a sub-shell.  We'll let it daemonize itself.
        #  There's no need to remember process ids, fusermount will bring
        #  it down with just the mount point.
        #
        cmd = [
            'vp',  # 'vp' must on on the system PATH
            '--mount={}'.format(self.mount_point),
            '--mentor={}'.format('cnc,7110,tcp4'),  # Mastiff vpm, hardwired for now.
            '--workspace={}'.format(self.workspace.pathname)
        ]
        if self.workspace.is_private:
            cmd = cmd + ['--fuse-cache=auto', '--timeout=1']
        else:
            cmd = cmd + ['--fuse-cache=none', '--timeout=0']
        subprocess.check_output(cmd)

    def unmount(self):
        """Un-mounts the VP."""
        subprocess.check_output(['fusermount', '-uz', self.mount_point])

    @property
    def mount_point(self):
        """str: Directory on which VP will be mounted."""
        return self._mount_point

    @property
    def workspace(self):
        """Workspace: Workspace instance used by this VP."""
        return self._workspace
