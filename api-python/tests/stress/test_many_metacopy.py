#
#  test_many_metacopy: Stress tests around metadata copy
#
#
#  If you can't import the following, put '.' on your PYTHONPATH
#    % PYTHONPATH=. pytest
#  or invoke this way:
#    % python3 -m pytest
#
import velstor.testlib as testlib
import os
import subprocess

seed = '+seed'
try:
    seed = '+' + os.environ['HOSTNAME']
except KeyError:
    pass


def metacopy_sequence(repetitions):
    pass


def test_metacopy_sequence():
    metacopy_sequence(20)

