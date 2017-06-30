from velstor import libutil


def test_urlencode_slash():
    assert(libutil.urlencode('/path/to/nowhere').lower() == '%2fpath%2fto%2fnowhere')