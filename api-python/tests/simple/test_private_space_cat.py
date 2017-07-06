from velstor.restapi import Session
from velstor import libtest
import os
import subprocess


def test_private_space_cat():
    with Session() as session:
        session.login('cnc:7130')
        m = libtest.Mount(
            session,
            '/tmp/pytest/joebob',
            pathname='/joebob',
            writeback='never')
        #
        #  Ensure it mounted
        subprocess.check_output(['bash', '-c', 'mount | fgrep {}'.format(m.mount_point)])
        #
        #  Create a file and cat it to another file
        #
        large_file_path = os.path.join(m.mount_point, 'large_file')
        cat_file_path = os.path.join(m.mount_point, 'large_file_copy')
        libtest.command('dd',
                        'if=/dev/urandom',
                        'of={}'.format(large_file_path),
                        'bs={}'.format(1024),
                        'count={}'.format(1024))
        assert(os.path.exists(large_file_path))
        libtest.command('bash', '-c', 'cat {} > {}'.format(large_file_path, cat_file_path))
        libtest.command('cmp', large_file_path, cat_file_path)
        libtest.command('rm', large_file_path, cat_file_path)
        #
        #  Clean up
        m.dispose()

