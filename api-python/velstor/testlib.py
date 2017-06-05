import string
import random


def random_identifier(length):
    return ''.join(random.choice(
        string.ascii_letters + '_' + string.digits
    ) for i in range(length))


def random_path(length, depth):
    return '/' + '/'.join(random_identifier(length) for i in range(depth))


def create_workspace_legacy(local):
    """Returns a single legacy workspace specification.
    """
    return [{
        'local': local,
        'vp_path': '/',
        'vtrq_id': 0,
        'vtrq_path': '/u/bubba',
    }]


def create_workspace(writeback):
    """Returns a single workspace specification.
    """
    return {
        'writeback': writeback,
        'maps': [{
            'vp_path': '/',
            'vtrq_id': 0,
            'vtrq_path': '/u/bubba',
        }]
    }

print(random_path(6, 4))