import string
import random
import subprocess
import json
import os


config = {
    'vcnc': 'cnc:7130',
    'vp_mount_root': '/tmp/vcnc/stress/',
    'vtrq': 'trq,7100,tcp4',
    'vtrqid': 0
}


def command(*args):
    """Runs a command in a subprocess"""
    print('command: Invoking ', ' '.join(args))
    rtn = subprocess.check_output(args).decode('utf-8')
    print(rtn)


def vclc(*args):
    """Invokes a vclc command and returns the results as a dictionary"""
    #
    # Form the command
    #
    cmd = ['./bin/vclc',
           '--vcnc=' + config['vcnc'],
           '--vtrqid=' + str(config['vtrqid'])] + list(args)
    print('vclc: invoking:', ' '.join(cmd))
    rtn = subprocess.check_output(cmd).decode('utf-8')
    print(rtn)
    return rtn


def vvclc(*args):
    """Invokes a vclc command and returns the results as a dictionary"""
    #
    # Form the command
    #
    cmd = ['./bin/vclc',
           '--vcnc=' + config['vcnc'],
           '--vtrqid=' + str(config['vtrqid'])] + list(args)
    print('vclc: invoking:', ' '.join(cmd))
    rtn = subprocess.check_output(cmd).decode('utf-8')
    print(rtn)
    return json.loads(rtn)


def create_workspace(**kwargs):
    """Creates a workspace specification as a Python data structure"""
    vtrq_id = kwargs['vtrq_id'] if 'vtrq_id' in kwargs else '0'
    vtrq_path = kwargs['vtrq_path'] if 'vtrq_path' in kwargs else '/'
    writeback = kwargs['writeback'] if 'writeback' in kwargs else 'always'
    return {'writeback': writeback,
            'maps': [{'vp_path': '/', 'vtrq_id': vtrq_id, 'vtrq_path': vtrq_path}]}


def create_workspace_vtrq(path, spec):
    """Creates a workspace specification on the vtrq
    
    Accepts a JSON string or a python data structure as the spec.
    """
    json_spec = spec if type(spec) is str else json.dumps(spec)
    #
    #  Clear out any existing spec
    #
    vvclc('ws', 'rm', path)
    #
    #  Post the new spec
    #
    result = vvclc('ws', 'set', path, json_spec)
    return result['http_status']


def delete_workspace_vtrq(path):
    """Deletes a workspace specification on the vtrq.
    
    Returns the HTTP status coce.
    """
    result = vvclc('ws', 'rm', path)
    return result['http_status']


def mount_vp(path, workspace):
    """Mounts a VP using 'workspace' on 'path'
    
    Assumes the appropriate vp is on the system path."""
    #
    #  Create a directory on 'path'
    #
    os.makedirs(path, exist_ok=True)
    #
    #  Invoke the VP
    cmd = ['vp',
           '--mount=' + path,
           '--mentor=' + config['vtrq'],
           '--workspace=' + workspace]
    print('mount_vp: invoking:', ' '.join(cmd))
    rtn = subprocess.check_output(cmd).decode('utf-8')
    print(rtn)
    return rtn


def unmount_vp(path):
    """Unmounts the VP on 'path'"""
    cmd = ['fusermount', '-uz', path]
    print('unmount_vp: invoking:', ' '.join(cmd))
    rtn = subprocess.check_output(cmd).decode('utf-8')
    print(rtn)
    return rtn


def random_identifier(length):
    return ''.join(random.choice(
        string.ascii_letters + '_' + string.digits
    ) for i in range(length))


def random_path(length, depth, prefix='/'):
    return prefix + '/'.join(random_identifier(length) for i in range(depth))


def create_workspace_legacy(local):
    """Returns a single legacy workspace specification.
    """
    return [{
        'local': local,
        'vp_path': '/',
        'vtrq_id': 0,
        'vtrq_path': '/u/bubba',
    }]


print(random_path(6, 4))