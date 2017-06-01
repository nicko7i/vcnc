#
#  test_sanity: make some quick checks against a live CNC/TRQ
#

import errno
import subprocess
import re
import json
import os

config = {
    'vcnc': 'cnc:7130',
    'vtrqid': 0
}

print(os.environ.keys)
seed = '+seed'
try:
    seed = '+' + os.environ['PLATFORM']
except:
    pass

def call(*args):
    """Invokes a clc command and returns the results as a dictionary"""
    #
    # Form the command
    #
    cmd = ['./bin/vclc'
           , '--vcnc=' + config['vcnc']
           , '--vtrqid=' + str(config['vtrqid'])] + list(args)
    print('call: invoking:', ' '.join(cmd))
    rtn =  subprocess.check_output(cmd).decode('utf-8')
    print(rtn)
    return rtn
    
def test_version():
    vre =  '\s*vclc\s+Version\s+\d+\.\d+\.\d+\s+Build\s+\d+'
    version = call('--version')
    print(version)
    assert(re.match(vre, version))

def test_ns_ls():
    for ns in ('ns', 'namespace'):
        result = call(ns, 'ls', '/')
        print(result)
        j = json.loads(result)
        assert(j["http_status"] == 200)


def test_ns_mk_rm_dir():
    dirname = '/Ime3Wp2uMyaHFLVoNKSf'+seed
    try:
        call('ns', 'rm', '-r', dirname)
    except:
        pass
    for ns in ('ns', 'namespace'):
        result = call('ns', 'mkdir', dirname)
        print('mkdir result:', result)
        j = json.loads(result)
        assert(j['http_status'] == 200)
        #
        result=call('ns', 'rm', dirname)
        print('rm result:', result)
        j = json.loads(result)
        assert(j['http_status'] == 200)

def test_ns_mk_rm_dir_deep():
    rootname = '/Ime3Wp2uMyaHFLVoNKSf'+seed
    dirname = rootname + '/91DWiFjayE0F98BH8tgu/C9VcnHmQ8ZBI4rLXHNge'
    try:
        call('ns', 'rm', '-r', rootname)
    except:
        pass
    for ns in ('ns', 'namespace'):
        result = call(ns, 'mkdir', '-p', dirname)
        print('mkdir result:', result)
        j = json.loads(result)
        assert(j['http_status'] == 200)
        #
        result=call(ns, 'rm', '-r', rootname)
        print('rm result:', result)
        j = json.loads(result)
        assert(j['http_status'] == 200)

def test_ns_copy():
    src_rootname = '/gq4OtHmyQbZhHmbc9dp5'+seed
    src_tailname = 'Tjso7JcL0zdz0hI3dBcP'
    srcdir = src_rootname + '/' + src_tailname
    dest_rootname = '/GmqYbvjQkoAEPQIGwzRa'+seed
    try:
        call('ns', 'rm', '-r', src_rootname)
    except:
        pass
    
    try:
        call('ns', 'rm', '-r', dest_rootname)
    except:
        pass
    for ns in ('ns', 'namespace'):
        for cmd in ('cp', 'copy'):
            call('ns', 'mkdir', '-p', srcdir)
            result = call(ns, cmd, src_rootname, dest_rootname)
            print('ns copy result:', result)
            j = json.loads(result)
            assert(j['http_status'] == 200)
            #
            call('ns', 'rm', '-r', src_rootname)
            call('ns', 'rm', '-r', dest_rootname)
    
    

def test_ns_consistency():
    dirname = '/Ime3Wp2uMyaHFLVoNKSf'+seed
    try:
        call('ns', 'mkdir', dirname)
    except:
        pass
    for ns in ('ns', 'namespace'):
        for con in ('consistency', 'con'):
            for val in ('immediate', 'eventual'):
                result = call(ns, con, 'set', val, dirname)
                print(ns, con, 'set', val, ':', result)
                j = json.loads(result)
                assert(j['http_status'] == 200)
                #
                result = call(ns, con, 'get', dirname)
                print(ns, con, 'get', val, ':', result)
                j = json.loads(result)
                assert(j['http_status'] == 200)
                #
    result=call(ns, 'rm', dirname)
    j = json.loads(result)
    assert(j['http_status'] == 200)
    

def test_vp_find():
    #
    # We're expecting ENOENT
    #
    try:
        result = call('vp', 'find', '--vp_host=scooby', '--mount_point=/doo')
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
        result = call('vp', 'get', '0x0123456789ABCDEF')
    except subprocess.CalledProcessError as e:
        assert(e.returncode == errno.ENOENT)

def test_vp_delete():
    try:
        result = call('vp', 'delete', '0x0123456789ABCDEF')
    except subprocess.CalledProcessError as e:
        assert(e.returncode == errno.ENOENT)

def test_ws_list():
    result = call('ws', 'list', '/')
    print('ws list result:', result)
    j = json.loads(result)
    assert(j['http_status'] == 200)
    

def test_ws_set_get_delete():
    root_name = '/GmqYbvjQkoAEPQIGwzRa'+seed
    ws_spec = '{"writeback": "always", "maps": [{"vp_path": "/", "vtrq_id": 10, "vtrq_path": "/u/carol"}]}'
    try:
        #  Clear out any existing spec
        call('ws', 'rm', root_name)
    except:
        print('Name clearing failed')
        pass

    for ws in ('ws', 'workspace'):
        for whack in ('rm', 'delete'):
            #
            #  Create a workspace specification
            result = call(ws, 'set', root_name, ws_spec)
            print('looky looky', ws, 'set', result)
            j = json.loads(result)
            assert(j['http_status'] == 200)
            #
            #  Delete it
            result = call(ws, whack, root_name)
            print(ws, whack, result)
            j = json.loads(result)
            assert(j['http_status'] == 200)
        
