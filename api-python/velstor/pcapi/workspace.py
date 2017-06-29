import json
import velstor.restapi.workspace as workspace
from velstor.pcapi.exceptions import raise_if_not_2xx


class Workspace:
    def __init__(self, session, **kwargs):
        self._pathname = kwargs['pathname'] if 'pathname' in kwargs else '/xyzzy'
        self.session = session
        self._vtrq_id = int(kwargs['vtrq_id'] if 'vtrq_id' in kwargs else 0)
        self._vtrq_path = kwargs['vtrq_path'] if 'vtrq_path' in kwargs else '/'
        self._writeback = kwargs['writeback'] if 'writeback' in kwargs else 'always'

    def get(self, pathname):
        """The HTTP get method"""
        response = workspace.get(self.session, 0, pathname)
        print(response)
        spec = json.loads(response['body'])['spec']
        raise_if_not_2xx(response['status_code'])
        return Workspace(
            self.session,
            vtrq_id=spec['maps'][0]['vtrq_id'],
            vtrq_path=spec['maps'][0]['vtrq_path'],
            pathname=pathname,
            writeback=spec['writeback'],
        )

    def set(self):
        """The HTTP set method"""
        doc = workspace.set(self.session, 0, self._pathname, self.json)
        raise_if_not_2xx(doc)

    def delete(self):
        """The HTTP delete method"""
        doc = workspace.delete(self.session, 0, self._pathname)
        raise_if_not_2xx(doc)

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
    def json(self):
        return json.dumps({
            'writeback': self.writeback,
            'maps': [{
                'vp_path': '/',
                'vtrq_id': self.vtrq_id,
                'vtrq_path': self.vtrq_path}]
        })
