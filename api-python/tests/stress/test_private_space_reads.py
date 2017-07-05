#
#  If you can't import the following, put '.' on your PYTHONPATH
#    % PYTHONPATH=. pytest
#  or invoke this way:
#    % python3 -m pytest
#
import velstor.libtest as libtest
import os
import subprocess


def test_private_space_reads():
    #
    #  Constants
    #
    vp_mount_root = '/tmp/vcnc/stress/'
    vtrq_path = '/test/stress'
    public_vp_mountpt = vp_mount_root + libtest.random_identifier(8)
    private_vp_mountpt = vp_mount_root + libtest.random_identifier(8)
    public_vp_workspace = libtest.create_workspace(vtrq_path=vtrq_path, writeback='always')
    private_vp_workspace = libtest.create_workspace(vtrq_path=vtrq_path, writeback='never')
    public_workspace_name = '/test/' + libtest.random_identifier(5)
    private_workspace_name = '/test/' + libtest.random_identifier(5)
    large_file_path_public = '{}/{}'.format(public_vp_mountpt, 'large.file')
    large_file_path_private = '{}/{}'.format(private_vp_mountpt, 'large.file')
    #
    #  Create the directory in the vtrq
    #
    try:
      libtest.vclc('ns', 'mkdir', '-p', vtrq_path)
    except libtest.VclcError:
        pass
    #
    #  Put the workspaces into the vtrq
    #
    libtest.create_workspace_vtrq(public_workspace_name, public_vp_workspace)
    libtest.create_workspace_vtrq(private_workspace_name, private_vp_workspace)
    #
    #  Create the mount points
    #
    libtest.command('mkdir', '-p', public_vp_mountpt)

    #
    #  Mount the public VP
    #
    libtest.mount_vp(public_vp_mountpt, public_workspace_name, is_private=False)
    #
    #  Put a large (1GB) file into the vtrq
    #
    libtest.command('dd',
                    'if=/dev/urandom',
                    'of={}'.format(large_file_path_public),
                    'bs={}'.format(1024 * 1024),
                    'count={}'.format(1024))
    #
    #  Now mount the private vp and make the (first) md5sum
    #  This shows up as vtrq reads on the dashboard.
    #
    libtest.mount_vp(private_vp_mountpt, private_workspace_name, is_private=True)
    libtest.command('md5sum', large_file_path_private)
    #
    #  Now do the md5sum twice more.  These should show up as
    #  vpm reads on the dashboard.
    libtest.command('md5sum', large_file_path_private)
    libtest.command('md5sum', large_file_path_private)
    #
    #  Delete the large file
    #
    libtest.command('rm', large_file_path_public)
    #
    #  Un-mount the VPs
    #
    libtest.unmount_vp(public_vp_mountpt)
    libtest.unmount_vp(private_vp_mountpt)
    #
    #  Remove the mount directories
    #
    libtest.command('rmdir', public_vp_mountpt)
    libtest.command('rmdir', private_vp_mountpt)
    #
    #  Delete the workspaces from the vtrq
    #
    libtest.delete_workspace_vtrq(public_workspace_name)
    libtest.delete_workspace_vtrq(private_workspace_name)
