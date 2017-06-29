#
#  If you can't import the following, put '.' on your PYTHONPATH
#    % PYTHONPATH=. pytest
#  or invoke this way:
#    % python3 -m pytest
#
import velstor.testlib as testlib
import os
import subprocess


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
    public_workspace_name = '/test/' + testlib.random_identifier(5)
    private_workspace_name = '/test/' + testlib.random_identifier(5)
    large_file_path_public = '{}/{}'.format(public_vp_mountpt, 'large.file')
    large_file_path_private = '{}/{}'.format(private_vp_mountpt, 'large.file')
    #
    #  Create the directory in the vtrq
    #
    try:
      testlib.vclc('ns', 'mkdir', '-p', vtrq_path)
    except testlib.VclcError:
        pass
    #
    #  Put the workspaces into the vtrq
    #
    testlib.create_workspace_vtrq(public_workspace_name, public_vp_workspace)
    testlib.create_workspace_vtrq(private_workspace_name, private_vp_workspace)
    #
    #  Create the mount points
    #
    testlib.command('mkdir', '-p', public_vp_mountpt)

    #
    #  Mount the public VP
    #
    testlib.mount_vp(public_vp_mountpt, public_workspace_name, is_private=False)
    #
    #  Put a large (1GB) file into the vtrq
    #
    testlib.command('dd',
                    'if=/dev/urandom',
                    'of={}'.format(large_file_path_public),
                    'bs={}'.format(1024 * 1024),
                    'count={}'.format(1024))
    #
    #  Now mount the private vp and make the (first) md5sum
    #  This shows up as vtrq reads on the dashboard.
    #
    testlib.mount_vp(private_vp_mountpt, private_workspace_name, is_private=True)
    testlib.command('md5sum', large_file_path_private)
    #
    #  Now do the md5sum twice more.  These should show up as
    #  vpm reads on the dashboard.
    testlib.command('md5sum', large_file_path_private)
    testlib.command('md5sum', large_file_path_private)
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
    #
    #  Delete the workspaces from the vtrq
    #
    testlib.delete_workspace_vtrq(public_workspace_name)
    testlib.delete_workspace_vtrq(private_workspace_name)
