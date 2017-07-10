import subprocess
from velstor.restapi import Session
from velstor.pcapi import Volume
from velstor.pcapi import Workspace


def test_lifecycle_success():
    with Session() as session:
        session.login('cnc:7130')
        #
        #  Put a workspace on the vtrq
        w = Workspace(session, pathname='/bubba', writeback='never')
        w.set(hard=True)
        #
        #  Mount a volume with that workspace
        v = Volume(session, '/tmp/pytest/bubba', w)
        v.mount(hard=True)
        #
        #  Ensure it mounted
        subprocess.check_output(['bash', '-c', 'mount | fgrep {}'.format(v.mount_point)])
        #
        #  Clean up
        v.unmount()
        w.delete()
