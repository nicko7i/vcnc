import os.path
from velstor.libtest import RESTException
from velstor.restapi import namespace


class Volume:
    def __init__(self, session, fsroot, workspace):
        self._session = session
        self._fsroot = os.path.abspath(fsroot)
        self._workspace = workspace

    def mount(self):
        if self._workspace.pathname is None:
            raise ValueError('Workspace has no pathname')
        #
        #  Create the vtrq_path if it doesn't already exist
        namespace.mkdir(
            self._session,
            self._workspace.vtrq_id,
            0o777,
            True,  # Create parents
            self._fsroot
        )
        #
        #  Run it in a sub-shell

    def unmount(self):
        pass

    @property
    def fsroot(self):
        return _fsroot

    @property
    def workspace(self):
        pass