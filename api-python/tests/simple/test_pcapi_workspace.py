from velstor.restapi import Session
from velstor.pcapi import Workspace
import json


def test_as_json():
    w = Workspace('session')
    print(w.json)
    json.loads(w.json)


def test_get_well_known_workspace():
    with Session() as session:
        session.login('cnc:7130')
        w = Workspace(session).get('/root/local')
        assert(w.pathname == '/root/local')

# def test_foo():
#    with Session() as session:
#        session.login('cnc:7130')
#        w = Workspace(session)
#        w.set()
