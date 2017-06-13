#
#  test_sanity: make some quick checks against a live vCNC/vTRQ
#
#
#  If you can't import the following, put '.' on your PYTHONPATH
#  % PYTHONPATH=. pytest
import velstor.testlib as testlib
from velstor.testlib import vclc
import errno
import subprocess
import re
import json
import os

seed = '+seed'
try:
    seed = '+' + os.environ['HOSTNAME']
except KeyError:
    pass


def test_version():
    vre = '\s*vclc\s+Version\s+\d+\.\d+\.\d+\s+Build\s+\d+'
    version = vclc('--version')
    print(version)
    assert(re.match(vre, version))


def test_ns_ls():
    for ns in ('ns', 'namespace'):
        result = vclc(ns, 'ls', '/')
        print(result)
        j = json.loads(result)
        assert(j["http_status"] == 200)


def test_ns_mk_rm_dir():
    dirname = '/Ime3Wp2uMyaHFLVoNKSf'+seed
    try:
        vclc('ns', 'rm', '-r', dirname)
    except subprocess.CalledProcessError as e:
        assert(e.returncode == errno.ENOENT)
    for ns in ('ns', 'namespace'):
        result = vclc(ns, 'mkdir', dirname)
        print('mkdir result:', result)
        j = json.loads(result)
        assert(j['http_status'] == 200)
        #
        result = vclc(ns, 'rm', dirname)
        print('rm result:', result)
        j = json.loads(result)
        assert(j['http_status'] == 200)


def test_ns_mk_rm_dir_deep():
    rootname = '/Ime3Wp2uMyaHFLVoNKSf'+seed
    dirname = rootname + '/91DWiFjayE0F98BH8tgu/C9VcnHmQ8ZBI4rLXHNge'
    try:
        vclc('ns', 'rm', '-r', rootname)
    except subprocess.CalledProcessError as e:
        assert(e.returncode == errno.ENOENT)

    for ns in ('ns', 'namespace'):
        result = vclc(ns, 'mkdir', '-p', dirname)
        print('mkdir result:', result)
        j = json.loads(result)
        assert(j['http_status'] == 200)
        #
        result = vclc(ns, 'rm', '-r', rootname)
        print('rm result:', result)
        j = json.loads(result)
        assert(j['http_status'] == 200)


def test_ns_copy():
    src_rootname = '/gq4OtHmyQbZhHmbc9dp5'+seed
    src_tailname = 'Tjso7JcL0zdz0hI3dBcP'
    srcdir = src_rootname + '/' + src_tailname
    dest_rootname = '/GmqYbvjQkoAEPQIGwzRa'+seed
    try:
        vclc('ns', 'rm', '-r', src_rootname)
    except subprocess.CalledProcessError as e:
        assert(e.returncode == errno.ENOENT)
    try:
        vclc('ns', 'rm', '-r', dest_rootname)
    except subprocess.CalledProcessError as e:
        assert(e.returncode == errno.ENOENT)
    for ns in ('ns', 'namespace'):
        for cmd in ('cp', 'copy'):
            vclc('ns', 'mkdir', '-p', srcdir)
            result = vclc(ns, cmd, src_rootname, dest_rootname)
            print('ns copy result:', result)
            j = json.loads(result)
            assert(j['http_status'] == 200)
            #
            vclc('ns', 'rm', '-r', src_rootname)
            vclc('ns', 'rm', '-r', dest_rootname)
    

def test_ns_consistency():
    dirname = '/Ime3Wp2uMyaHFLVoNKSf'+seed
    for ns in ('ns', 'namespace'):
        for con in ('consistency', 'con'):
            for val in ('immediate', 'eventual'):
                vclc(ns, 'mkdir', dirname)
                result = vclc(ns, con, 'set', val, dirname)
                j = json.loads(result)
                assert(j['http_status'] == 200)
                #
                result = vclc(ns, con, 'get', dirname)
                print(ns, con, 'get', val, ':', result)
                j = json.loads(result)
                assert(j['http_status'] == 200)
                result = vclc(ns, 'rm', dirname)
                j = json.loads(result)
                assert(j['http_status'] == 200)


def test_vp_find():
    #
    # We're expecting ENOENT
    #
    try:
        result = vclc('vp', 'find', '--vp_host=scooby', '--mount_point=/doo')
        print('vp find:', result)
        j = json.loads(result)
        assert(j['http_status'] == 404)
    except subprocess.CalledProcessError as e:
        print('vp find:', e.output)
        j = json.loads(e.output.decode('utf-8'))
        assert(j['http_status'] == 404)
        assert(e.returncode == errno.ENOENT)


def test_vp_get():
    try:
        vclc('vp', 'get', '0x0123456789ABCDEF')
    except subprocess.CalledProcessError as e:
        assert(e.returncode == errno.ENOENT)


def test_vp_delete():
    try:
        vclc('vp', 'delete', '0x0123456789ABCDEF')
    except subprocess.CalledProcessError as e:
        assert(e.returncode == errno.ENOENT)


def test_ws_list():
    result = vclc('ws', 'list', '/')
    print('ws list result:', result)
    j = json.loads(result)
    assert(j['http_status'] == 200)
    

def test_ws_set_get_delete():
    root_name = '/GmqYbvjQkoAEPQIGwzRa'+seed
    ws_spec = '{"writeback": "always", "maps": [{"vp_path": "/", "vtrq_id": 10, "vtrq_path": "/u/carol"}]}'
    #  Clear out any existing spec
    vclc('ws', 'rm', root_name)

    for ws in ('ws', 'workspace'):
        for whack in ('rm', 'delete'):
            #
            #  Create a workspace specification
            result = vclc(ws, 'set', root_name, ws_spec)
            print(ws, 'set', result)
            j = json.loads(result)
            assert(j['http_status'] == 200)
            #
            #  Delete it
            result = vclc(ws, whack, root_name)
            print(ws, whack, result)
            j = json.loads(result)
            assert(j['http_status'] == 200)


def test_grid_list():
    result = vclc('grid', 'list')
    j = json.loads(result)
    assert(j['http_status'] == 200)


def test_grid_lifecycle():
    #
    #  Define a workspace
    workspace_name = testlib.random_path(5,1)
    workspace_spec = testlib.create_workspace(writeback='never')
    result = vclc('ws', 'set', workspace_name, json.dumps(workspace_spec))
    j = json.loads(result)
    assert(j['http_status'] == 200)
    #
    #  Post a grid entry
    grid_id = testlib.random_identifier(6)
    result = vclc('grid', 'post', grid_id, workspace_name)
    j = json.loads(result)
    assert(j['http_status'] == 200)
    #
    #  Look at the grid entry
    result = vclc('grid', 'get', grid_id)
    j = json.loads(result)
    assert(j['http_status'] == 200)
    #
    #  Delete the grid entry
    result = vclc('grid', 'delete', grid_id)
    j = json.loads(result)
    assert(j['http_status'] == 200)
    #
    #  Ensure it's gone
    try:
        vclc('grid', 'get', grid_id)
        assert False
    except subprocess.CalledProcessError as e:
        assert(e.returncode == errno.ENOENT)
    #
    #  Delete the workspace
    result = vclc('ws', 'rm', workspace_name)
    j = json.loads(result)
    assert(j['http_status'] == 200)
