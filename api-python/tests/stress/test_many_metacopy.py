#
#  test_many_metacopy: Stress tests around metadata copy
#
#
#  If you can't import the following, put '.' on your PYTHONPATH
#  % PYTHONPATH=. pytest
import velstor.testlib as testlib
import os

seed = '+seed'
try:
    seed = '+' + os.environ['HOSTNAME']
except KeyError:
    pass


def metacopy_sequence(repetitions):
    pass


def test_metacopy_sequence():
    metacopy_sequence(20)


def test_private_space_reads():
    #
    #  Constants
    #
    vp_mount_root = '/tmp/vcnc/stress/'
    vtrq_path = '/test/stress'
    public_vp_mountpt = vp_mount_root + testlib.random_identifier(8)
    private_vp_mountpt = vp_mount_root + testlib.random_identifier(8)
    public_vp_workspace = testlib.create_workspace(vtrq_path=vtrq_path, writeback='always')
    private_vp_workspace = testlib.create_workspace(vtrq_path=vtrq_path, writeback='never')
    large_file_path_public = '{}/{}'.format(public_vp_mountpt, 'large.file')
    large_file_path_private = '{}/{}'.format(private_vp_mountpt, 'large.file')
    #
    #  Mount the VPs
    #
    testlib.mount_vp(public_vp_mountpt, public_vp_workspace)
    testlib.mount_vp(private_vp_mountpt, private_vp_workspace)
    #
    #  Put a large (1GB) file into the vtrq
    #
    testlib.command('dd',
                    'if=/dev/urandom',
                    'of={}'.format(large_file_path_public),
                    'bs={}'.format(1024 * 1024),
                    'count={}'.format(1024))
    #
    #  It's visible to the private space, so copy it to /dev/null in the
    #  private space.  This shows up as vtrq reads on the dashboard.
    #
    testlib.command('cp', large_file_path_public, '/dev/null')
    #
    #  Now do the copy to /dev/null twice more.  These should show up as
    #  vpm reads on the dashboard.
    testlib.command('cp', large_file_path_private, '/dev/null')
    testlib.command('cp', large_file_path_private, '/dev/null')
    #
    #  Delete the large file
    #
    testlib.command('rm', large_file_path_public)
    #
    #  Un-mount the VPs
    #
    testlib.unmount_vp(public_vp_mountpt)
    testlib.unmount_vp(private_vp_mountpt)
    #
    #  Remove the mount directories
    #
    testlib.command('rmdir', public_vp_mountpt)
    testlib.command('rmdir', private_vp_mountpt)
