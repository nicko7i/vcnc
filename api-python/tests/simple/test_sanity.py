#
#  test_sanity: make some quick checks against a live vCNC/vTRQ
#
#
#  If you can't import the following, put '.' on your PYTHONPATH
#  % PYTHONPATH=. pytest
import velstor.libtest as libtest
from velstor.libtest import vclc
from velstor.libtest import VclcError
import errno
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
    try:
        # libtest.vclc assumes that stdout is valid JSON
        # This is intentionally not the case for --version.
        vclc('--version')
        assert False
    except VclcError as e:
        version = e.output
        print(version)
        assert(re.match(vre, version))


def test_ns_ls():
    for ns in ('ns', 'namespace'):
        result = vclc(ns, 'ls', '/')
        print(result)
        assert(result["http_status"] == 200)


def test_ns_mk_rm_dir():
    dirname = '/Ime3Wp2uMyaHFLVoNKSf'+seed
    try:
        vclc('ns', 'rm', '-r', dirname)
        assert False
    except VclcError as e:
        assert(e.returncode == errno.ENOENT)
    for ns in ('ns', 'namespace'):
        result = vclc(ns, 'mkdir', dirname)
        print('mkdir result:', result)
        assert(result['http_status'] == 200)
        #
        result = vclc(ns, 'rm', dirname)
        print('rm result:', result)
        assert(result['http_status'] == 200)


def test_ns_mk_rm_dir_deep():
    rootname = '/Ime3Wp2uMyaHFLVoNKSf'+seed
    dirname = rootname + '/91DWiFjayE0F98BH8tgu/C9VcnHmQ8ZBI4rLXHNge'
    try:
        vclc('ns', 'rm', '-r', rootname)
        assert False
    except VclcError as e:
        assert(e.returncode == errno.ENOENT)

    for ns in ('ns', 'namespace'):
        result = vclc(ns, 'mkdir', '-p', dirname)
        print('mkdir result:', result)
        assert(result['http_status'] == 200)
        #
        result = vclc(ns, 'rm', '-r', rootname)
        print('rm result:', result)
        assert(result['http_status'] == 200)


def test_ns_copy():
    src_rootname = '/gq4OtHmyQbZhHmbc9dp5'+seed
    src_tailname = 'Tjso7JcL0zdz0hI3dBcP'
    srcdir = src_rootname + '/' + src_tailname
    dest_rootname = '/GmqYbvjQkoAEPQIGwzRa'+seed
    #
    #  Ensure neither the source nor destination directory exists.
    #
    try:
        vclc('ns', 'rm', '-r', src_rootname)
    except VclcError as e:
        pass
    try:
        vclc('ns', 'rm', '-r', dest_rootname)
    except VclcError as e:
        pass
    #
    #  Try to copy non-existent directories.
    #
    try:
        vclc('ns', 'cp', srcdir, dest_rootname)
        assert False
    except VclcError as e:
        assert(e.returncode == errno.ENOENT)
    #
    #  Copy directories that exist.  Test all aliases. Expect success.
    #
    for ns in ('ns', 'namespace'):
        for cmd in ('cp', 'copy'):
            vclc('ns', 'mkdir', '-p', srcdir)
            result = vclc(ns, cmd, src_rootname, dest_rootname)
            print('ns copy result:', result)
            assert(result['http_status'] == 200)
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
                assert(result['http_status'] == 200)
                #
                result = vclc(ns, con, 'get', dirname)
                print(ns, con, 'get', val, ':', result)
                assert(result['http_status'] == 200)
                result = vclc(ns, 'rm', dirname)
                assert(result['http_status'] == 200)


def test_vp_find():
    #
    # We're expecting ENOENT
    #
    try:
        result = vclc('vp', 'find', '--vp_host=scooby', '--mount_point=/doo')
        print('vp find:', result)
        assert False
    except VclcError as e:
        print('vp find:', e.output)
        assert(e.http_status == 404)
        assert(e.returncode == errno.ENOENT)


def test_vp_get():
    try:
        vclc('vp', 'get', '0x0123456789ABCDEF')
        assert False
    except VclcError as e:
        assert(e.returncode == errno.ENOENT)


def test_vp_delete():
    try:
        vclc('vp', 'delete', '0x0123456789ABCDEF')
        assert False
    except VclcError as e:
        assert(e.returncode == errno.ENOENT)


def test_ws_list():
    result = vclc('ws', 'list', '/')
    print('ws list result:', result)
    assert(result['http_status'] == 200)
    

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
            assert(result['http_status'] == 200)
            #
            #  Delete it
            result = vclc(ws, whack, root_name)
            print(ws, whack, result)
            assert(result['http_status'] == 200)


def test_grid_list():
    result = vclc('grid', 'list')
    assert(result['http_status'] == 200)


def test_grid_lifecycle():
    #
    #  Define a workspace
    workspace_name = libtest.random_path(5,1)
    workspace_spec = libtest.create_workspace(writeback='never')
    result = vclc('ws', 'set', workspace_name, json.dumps(workspace_spec))
    assert(result['http_status'] == 200)
    #
    #  Post a grid entry
    grid_id = libtest.random_identifier(6)
    result = vclc('grid', 'post', grid_id, workspace_name)
    assert(result['http_status'] == 200)
    #
    #  Look at the grid entry
    result = vclc('grid', 'get', grid_id)
    assert(result['http_status'] == 200)
    #
    #  Delete the grid entry
    result = vclc('grid', 'delete', grid_id)
    assert(result['http_status'] == 200)
    #
    #  Ensure it's gone
    try:
        vclc('grid', 'get', grid_id)
        assert False
    except VclcError as e:
        assert(e.returncode == errno.ENOENT)
    #
    #  Delete the workspace
    result = vclc('ws', 'rm', workspace_name)
    assert(result['http_status'] == 200)
