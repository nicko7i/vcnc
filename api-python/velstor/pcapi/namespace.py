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

    @property
    def cwd(self):
        """str: Gets or sets the current working directory."""
        return self._cwd

    def cwd(self, path):
        self._cwd = path

    def clone(self, src, dest, **kwargs):
        """
        Makes a meta-data copy of a file or directory.

        Args:
            src: The directory to clone.
            dest: The root of the cloned directory.

        Keyword Args:
            overwrite (bool): When true, an existing destination is overwritten
              with 'cp -r' semantics; otherwise, TBD.  Default is False

        Raises:
            RESTException:
        """
        overwrite = kwargs['overwrite'] if 'overwrite' in kwargs else False
        pass

    def delete(self, path):
        """
        Deletes the namespace node at 'path'.

        Args:
            path (str): Node to delete.
            **kwargs: Optional arguments.

        Keyword Args:
            recursive (bool): When True, delete subdirectories, otherwise,
              raises an exception if subdirectories exist.

        Raises:
            CheckedOutputException:
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

        Raises:
            CheckedOutputException:
        """
        pass

    def list(self, path, **kwargs):
        """
        Lists the contents of a directory.

        Args:
            path (str): The directory to list.
            **kwargs: Optional arguments.

        Keyword Args:
            details: if True, returns the 'stat' information for each child.

        Returns:
            List[str]: if 'details' is False
            List[Dict]: if 'details' is True

        Raises:
            CheckedOutputException:
        """
        pass

    def ls(self, path):
        """
        An alias for 'list'
        """
        return self.list(path)

    def mkfile(self, path):
        """
        Creates a file of a specified size on the vtrq.

        Args:
            path (str): The directory to list.

        Keyword Args:
            parents (bool): If true, create missing intermediate directories.
                Default is to raise an error.
            mode (int): The filesystem read/write/execute mode. Default is 0o755.
            size (int): The size in bytes of the file to be created. Default is 0.
            force (bool): If True, an existing file is overwritten. Otherwise,
                raises an exception.  Default is False.

        Raises:
            CheckedOutputException:
        """
