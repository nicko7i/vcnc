"""

"""

from velstor.libutil import print_error  # NOQA


# See http://stackoverflow.com/questions/865115/how-do-i-correctly-clean-up-a-python-object  # NOQA
# for an explanation of 'class SessionWorker'
class Session:
    """
    Creates and manages a new login session with the vCNC
    """
    def __enter__(self):
        class SessionWorker:
            def __init__(self):
                # print_error('constructing Client')
                pass

            def cleanup(self):
                # print_error('cleaning up')
                pass

            def login(self, host):
                """ Connects to the vCNC server and begins a session.

                Args:
                    host: hostname[:path] of the vCNC server.
                """
                # print_error(['connecting to', host])
                self.host = host
                return self

            def base_url(self):
                return 'http://' + self.host + '/v1'

        self.instance = SessionWorker()
        return self.instance

    def __exit__(self, exc_type, exc_value, traceback):
        self.instance.cleanup()
