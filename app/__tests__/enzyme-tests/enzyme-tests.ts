import * as React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

const sinon = require('sinon')

// import components
import * as Header from "../../src/components/Header";

configure({ adapter: new Adapter() });

describe('React unit tests', () => {

  let testProps = {
    handlers: {},
    selectedTab: "tab0",
    leftArray: [],
    tabPrimaryKey: 0,
    handlerInfo: {},
    activeTab: {},
    tabInfo: {},
  };

  describe('Header', () => {
    let wrapper;
    let props = { ...testProps };

    beforeAll(() => {
      wrapper = shallow(<Header {...props} />);
    });

    it(`renders a <div> tag with a className of 'Header'`, () => {
      expect(wrapper.type()).toEqual('div');
      expect(wrapper.hasClass('header')).toBe(true);
    });
  })
}
