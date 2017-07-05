import os.path
import subprocess
from velstor.restapi import namespace
from velstor.pcapi.exceptions import RESTException


class Volume:
    def __init__(self, session, mount_point, workspace):
        self._session = session
        self._mount_point = os.path.abspath(mount_point)
        self._workspace = workspace

    def mount(self, **kwargs):
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
            'vp',
            '--mount={}'.format(self.mount_point),
            '--mentor={}'.format('cnc,7110,tcp4'),  # Mastiff vpm, hardwired for now.
            '--workspace={}'.format(self.workspace.pathname)
        ]
        if self.workspace.is_private:
            cmd = cmd + ['--fuse-cache=none', '--timeout=0']
        subprocess.check_output(cmd)

    def unmount(self):
        subprocess.check_output(['fusermount', '-uz', self.mount_point])

    @property
    def mount_point(self):
        return self._mount_point

    @property
    def workspace(self):
        return self._workspace
