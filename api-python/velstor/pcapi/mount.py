from velstor.pcapi import Workspace, Volume


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
        """int: Identifier of vtrq."""
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