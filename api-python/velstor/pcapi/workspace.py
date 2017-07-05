import json
import velstor.restapi.workspace as workspace
from velstor.pcapi.exceptions import raise_if_not_2xx, RESTException
from velstor.libutil import CommonEqualityMixin


class Workspace(CommonEqualityMixin):
    def __init__(self, session, **kwargs):
        self._pathname = kwargs['pathname'] if 'pathname' in kwargs else None
        self.session = session
        self._vtrq_id = int(kwargs['vtrq_id'] if 'vtrq_id' in kwargs else 0)
        self._vtrq_path = kwargs['vtrq_path'] if 'vtrq_path' in kwargs else '/'
        self._writeback = kwargs['writeback'] if 'writeback' in kwargs else 'always'

    def get(self, pathname=None):
        """The HTTP get method"""
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
        """The HTTP set method"""
        if not self._pathname:
            raise ValueError('Workspace.set: Workspace instance has no pathname')
        hard = kwargs['hard'] if 'hard' in kwargs else False
        if hard:
            self.delete(hard=True)
        doc = workspace.set(self.session, 0, self._pathname, self.json)
        raise_if_not_2xx(doc)

    def delete(self, **kwargs):
        """The HTTP delete method"""
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
        return self._vtrq_id

    @property
    def vtrq_path(self):
        return self._vtrq_path

    @property
    def writeback(self):
        return self._writeback

    @property
    def pathname(self):
        return self._pathname

    @property
    def is_private(self):
        return self.writeback != 'always'

    @property
    def json(self):
        return json.dumps({
            'writeback': self.writeback,
            'maps': [{
                'vp_path': '/',
                'vtrq_id': self.vtrq_id,
                'vtrq_path': self.vtrq_path}]
        })
