import * as React from 'react';
import { configure, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
const sinon = require('sinon')

// import components
import { Header } from "../../src/components/Header"
import App from "../../src/App";

configure({ adapter: new Adapter() });

describe('React unit tests', () => {
  describe('Header', () => {
    let wrapper;
    let props = {
      tabInfo: { 
        tab0: {
          name: "New Connection",
          activeResponseTab: "server"
        }
      },
      updateTabNames: null,
      handlerInfo: {},
      handleClientStreamStart: null,
      handleServerStreamStart: null,
      handleBidiStreamStart: null,
      handleUnaryRequest: null,
      toggleStream: null,
      activeTab: { requestConfig: {}, baseConfig: {grpcServerURI: "testURL"} },
      getTabState: null,
      selectTab: null,
      removeTab: null,
      addNewTab: null,
      leftArray: [{
        props: {
          tabKey: 'tab0',
        }
      }],
      selectedTab: null,
      handleStopStream: null
    };

    beforeAll(() => {
      wrapper = shallow(<Header {...props} />);
    });

    it('should render', () => {
      expect(wrapper).toBeTruthy()
    });

    it('should display a url based on the value of activeTab.baseConfig.grpcServerURI', () => {
      expect(wrapper.find('.trail').text()).toBe('testURL → ');
    });

    it('should display a tab based on the contents of LeftArray', () => {
      expect(wrapper.find('.tab')).toBeTruthy();
    });

    it('should display a tab title based on the value of tabInfo', () => {
      expect(wrapper.find('.tab').text()).toBe('New Connection');
    });

    it('should display a default tab title if the user does not provide one', () => {
      wrapper.setProps({
        tabInfo: {}
      })
      expect(wrapper.find('.tab').text()).toBe('Connection');
    });

  });
});

