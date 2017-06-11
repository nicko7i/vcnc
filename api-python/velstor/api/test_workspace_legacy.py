import json
import pytest
import velstor.api.workspace_legacy as uut  # 'unit under test'


def make_legacy_spec(local):
    """Returns a single legacy workspace specification.
    """
    return [{
        'local': local,
        'vp_path': '/',
        'vtrq_id': 0,
        'vtrq_path': '/u/bubba',
    }]


def make_delegation_spec(writeback):
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


def test_legacy_comparison():
    assert(make_legacy_spec(True) == make_legacy_spec(True))
    assert(make_legacy_spec(True) != make_legacy_spec(False))


def test_delegation_comparison():
    assert(make_delegation_spec('always') == make_delegation_spec('always'))
    assert(make_delegation_spec('never') != make_delegation_spec('always'))


def test_convert_to_delegation():
    assert(
        uut.to_delegation_from_legacy(make_legacy_spec(True)) == make_delegation_spec('never')
    )
    assert(
        uut.to_delegation_from_legacy(make_legacy_spec(False)) == make_delegation_spec('always')
    )


def test_convert_legacy_response_body():
    #  The method under test returns a json.loads() string, which is not
    #  guaranteed to always yield the same string for a given dictionary.
    #  Therefore, the comparison is done over objects, not JSON strings.
    assert(
        json.loads(uut._to_delegation_from_response_body(
            json.dumps({'spec': make_legacy_spec(True)})
        )) == {'spec': make_delegation_spec('never')}
    )
    assert(
        json.loads(uut._to_delegation_from_response_body(
            json.dumps({'spec': make_legacy_spec(False)})
        )) == {'spec': make_delegation_spec('always')}
    )


def test_convert_to_legacy():
    assert(
        uut._to_legacy_from_delegation(make_delegation_spec('never')) == make_legacy_spec(True)
    )
    assert(
        uut._to_legacy_from_delegation(make_delegation_spec('trickle')) == make_legacy_spec(True)
    )
    assert(
        uut._to_legacy_from_delegation(make_delegation_spec('explict')) == make_legacy_spec(True)
    )
    assert(
        uut._to_legacy_from_delegation(make_delegation_spec('always')) == make_legacy_spec(False)
    )
    with pytest.raises(ValueError):
        assert(
            uut._to_legacy_from_delegation(make_delegation_spec('xyzzy')) == make_legacy_spec(False)
        )
