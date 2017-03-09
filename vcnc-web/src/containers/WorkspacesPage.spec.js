import React from 'react';
import {shallow} from 'enzyme';
import {WorkspacesPage} from './WorkspacesPage';
import WorkspacesPageLayout from '../components/WorkspacesPageLayout';

describe('<WorkspacesPage />', () => {
  it('should contain <WorkspacesPageLayout />', () => {
    const actions = { };
    const fuelSavings = {};
    const wrapper = shallow(<WorkspacesPage actions={actions} fuelSavings={fuelSavings}/>);

    expect(wrapper.find(WorkspacesPageLayout).length).toEqual(1);
  });
});
