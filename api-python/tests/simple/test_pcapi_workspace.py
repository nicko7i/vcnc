import pytest
import json
from velstor.restapi import Session
from velstor.pcapi import Workspace
from velstor.pcapi import RESTException
from velstor.libtest import Config


config = Config()


def test_as_json():
    """Tests whether the Workspace JSON representation is valid JSON"""
    w = Workspace('session')
    json.loads(w.json)


def test_get_well_known_workspace():
    with Session() as session:
        session.login(config.vcnc)
        w = Workspace(session).get('/root/local')
        assert(w.pathname == '/root/local')
        assert(w.vtrq_id == 0)
        assert(w.vtrq_path == '/')
        assert(w.writeback == 'always')


def test_set_no_pathname():
    with Session() as session:
        session.login(config.vcnc)
        w = Workspace(session)
        try:
            w.set()
            assert False
        except ValueError:
            assert True


def test_equality_operator():
    w1 = Workspace(None, pathname='/molly', writeback='always')
    w2 = Workspace(None, pathname='/molly', writeback='always')
    w3 = Workspace(None, pathname='/bubba', writeback='never')
    assert(w1 == w1)
    assert(w1 == w2)
    assert(w1 != w3)
    assert(w2 != w3)
    #
    assert(not (w1 != w1))
    assert(not (w1 != w2))
    assert(not (w1 == w3))
    assert(not (w2 == w3))


def test_lifecycle_success():
    with Session() as session:
        session.login(config.vcnc)
        w = Workspace(session, pathname='/bubba', writeback='never')
        #
        #  Prepare by deleting any existing workspace.
        #
        try:
            w.delete()
        except RESTException:
            pass
        #
        #  Create/Get/Delete
        #  We expect these methods to raise a RESTException if they fail
        #
        w.set()
        assert(w.get() == w)
        w.delete()


def test_get_enoent():
    with Session() as session:
        session.login(config.vcnc)
        try:
            Workspace(session, pathname='/not/even').get()
            assert False
        except RESTException as e:
            assert(e.error_sym == 'ENOENT')
            assert(e.http_code == 404)


@pytest.mark.xfail
def test_delete_enoent():
    with Session() as session:
        session.login(config.vcnc)
        try:
            Workspace(session, pathname='/not/even').delete()
            assert False
        except RESTException as e:
            assert(e.error_sym == 'ENOENT')
            assert(e.http_code == 404)


def test_get_default():
    with Session() as session:
        session.login(config.vcnc)
        try:
            Workspace(session).get()
            assert False
        except ValueError:
            pass


def test_set_default():
    with Session() as session:
        session.login(config.vcnc)
        try:
            Workspace(session).set()
            assert False
        except ValueError:
            pass


def test_delete_default():
    with Session() as session:
        session.login(config.vcnc)
        try:
            Workspace(session).delete()
            assert False
        except ValueError:
            pass

