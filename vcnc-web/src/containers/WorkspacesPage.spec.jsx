//  This is a development file even though eslint doesn't think so.
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { shallow } from 'enzyme';
import { WorkspacesPage } from './WorkspacesPage';
import WorkspacesPageLayout from '../components/WorkspacesPageLayout';

describe('<WorkspacesPage />', () => {
  it('should contain <WorkspacesPageLayout />', () => {
    const actions = { };
    const wrapper = shallow(<WorkspacesPage actions={actions} />);

    expect(wrapper.find(WorkspacesPageLayout).length).toEqual(1);
  });
});
