import json
import velstor.restapi.workspace as workspace
from velstor.pcapi.exceptions import raise_if_not_2xx, RESTException


class Namespace:
    """
    Provides convenient, contextual access to a vtrq namespace.
    
    Args:
        session (Session): A session object.
        **kwargs: Optional keywords described below.

    Keyword Args:
        cwd (str): Initial working directory. Default is '/'.
        vtrq_id (int): vtrq ID.  Default is 0.
    """
    def __init__(self, session, **kwargs):
        self._cwd = kwargs['cwd'] if 'cwd' in kwargs else '/'
        self.session = session
        self._vtrq_id = int(kwargs['vtrq_id'] if 'vtrq_id' in kwargs else 0)

    def clone(self, src, dest, **kwargs):
        """

        Args:
            src: The directory to clone.
            dest: The root of the cloned directory.

        Keyword Args:
            overwrite (bool): When true, an existing destination is overwritten
              with 'cp -r' semantics; otherwise, TBD.  Default is False

        Returns:
            TBD
        """
        overwrite = kwargs['overwrite'] if 'overwrite' in kwargs else False
        pass

    def delete(self, path, recursive=False):
        """
        Deletes the namespace node at 'path'.

        Args:
            path (str): Node to delete.
            recursive (bool): When true, delete subdirectories, otherwise,
              raises an exception if subdirectories exist.

        Returns:
            TBD
        """

    def mkdir(self, path, **kwargs):
        """
        Creates a directory at 'path'.

        Args:
            path (str): The directory to create.
            **kwargs: Optional arguments.

        Keyword Args:
            parents (bool): If true, create missing intermediate directories.
                Default is to raise an error.
            mode (int): The filesystem read/write/execute mode. Default is 0o755.

        Returns:
            TBD
        """
        pass

    def list(self, path, details=False):
        """
        Lists the contents of a directory.

        Args:
            path (str): The directory to list.
            details: if True, returns the 'stat' information for each child.

        Returns:
            TBD
        """
        pass

    def ls(self, path):
        """
        An alias for 'list'
        """
        return self.list(path)

