import json
import velstor.restapi.workspace as workspace
from velstor.pcapi.exceptions import raise_if_not_2xx, RESTException
from velstor.libutil import CommonEqualityMixin


class Workspace(CommonEqualityMixin):
    """
    Represents a vtrq workspace and its hierarchical name.
    
    Args:
        session (Session): A session object.
        **kwargs: Optional keywords described below.

    Keyword Args:
        pathname (str): hierarchical workspace name. Default is None.
        vtrq_id (int): vtrq ID.  Default is 0.
        vtrq_path (str): Absolute vtrq path mapped to mount point. Default is '/'.
        writeback (str): Writeback semantics.  One of 'always', 'explicit',
            'trickle' or 'never'.  Default is 'always'.
    """
    def __init__(self, session, **kwargs):
        self._pathname = kwargs['pathname'] if 'pathname' in kwargs else None
        self.session = session
        self._vtrq_id = int(kwargs['vtrq_id'] if 'vtrq_id' in kwargs else 0)
        self._vtrq_path = kwargs['vtrq_path'] if 'vtrq_path' in kwargs else '/'
        self._writeback = kwargs['writeback'] if 'writeback' in kwargs else 'always'

    def get(self, pathname=None):
        """
        Retrieves a workspace specification from the vtrq.
        
        Args:
            pathname (str): The hierarchical workspace name. The default is to use the
                name within this object.
                
        Returns:
            Workspace: A new :class:`Workspace` initialized from the vtrq.
        """
        pathname = self._pathname if pathname is None else pathname
        if not pathname:
            raise ValueError('Workspace.get: Workspace instance has no pathname')
        response = workspace.get(self.session, 0, pathname)
        raise_if_not_2xx(response)
        spec = json.loads(response['body'])['spec']
        return Workspace(
            self.session,
            vtrq_id=spec['maps'][0]['vtrq_id'],
            vtrq_path=spec['maps'][0]['vtrq_path'],
            pathname=pathname,
            writeback=spec['writeback'],
        )

    def set(self, **kwargs):
        """
        Stores a Workspace on the vtrq.
        
        Args:
            **kwargs: Optional keyword arguments.

        Keyword Args:
            hard (bool): if true, ignores EEXIST and ENOENT.
        """
        if not self._pathname:
            raise ValueError('Workspace.set: Workspace instance has no pathname')
        hard = kwargs['hard'] if 'hard' in kwargs else False
        if hard:
            self.delete(hard=True)
        doc = workspace.set(self.session, 0, self._pathname, self.json)
        raise_if_not_2xx(doc)

    def delete(self, **kwargs):
        """
        Removes a Workspace from the vtrq.
        
        Args:
            **kwargs: Optional keyword arguments.
            
        Keyword Args:
            hard (bool): if true, ignores EEXIST and ENOENT.

        Raises:
            RESTException: Something went awry talking to the REST server.
            ValueError: This workspace instance doesn't have a hierarchical name.
        """
        if not self._pathname:
            raise ValueError('Workspace.delete: Workspace instance has no pathname')
        hard = kwargs['hard'] if 'hard' in kwargs else False
        try:
            doc = workspace.delete(self.session, 0, self._pathname)
            raise_if_not_2xx(doc)
        except RESTException as e:
            if hard and e.error_sym == 'ENOENT':
                pass  # We don't care if it doesn't exist
            else:
                raise

    @property
    def vtrq_id(self):
        """int: Identifer of vtrq."""
        return self._vtrq_id

    @property
    def vtrq_path(self):
        """str: Absolute vtrq path mapped by this workspace."""
        return self._vtrq_path

    @property
    def writeback(self):
        """str:  Writeback value."""
        return self._writeback

    @property
    def pathname(self):
        """str:  Hierarchical workspace name."""
        return self._pathname

    @property
    def is_private(self):
        """bool: True if this workspace is 'private', False otherwise."""
        return self.writeback != 'always'

    @property
    def json(self):
        """str:  A JSON representation of the Workspace specification, not including the name."""
        return json.dumps({
            'writeback': self.writeback,
            'maps': [{
                'vp_path': '/',
                'vtrq_id': self.vtrq_id,
                'vtrq_path': self.vtrq_path}]
        })
