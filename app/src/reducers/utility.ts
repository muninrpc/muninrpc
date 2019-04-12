import * as uniqid from "uniqid";
import { TabState, AppModel, Mode } from "../models";
import { Trie } from "../utils/trieClass";

export function AppModelCreator(): AppModel {
  const initialTab = newTabStateCreator();
  const uid = initialTab.tabId;

  return {
    tabMap: { [uid]: initialTab },
    tabArr: [uid],
    activeTab: uid,
  };
}

export function newTabStateCreator(): TabState {
  return {
    baseConfig: { grpcServerURI: "192.168.0.139", packageDefinition: null, packageName: "", serviceName: "" },
    configArguments: { arguments: {} },
    configElements: { arguments: {} },
    filePath: "",
    messageList: {},
    messageTrie: new Trie(),
    messageTrieInput: "",
    messageRecommendations: [],
    mode: Mode.SHOW_SERVICE,
    requestConfig: { requestName: "", callType: null, streamConfig: {}, argument: {} },
    requestTrie: new Trie(),
    responseMetrics: "",
    serviceList: {},
    serviceRecommendations: [],
    serverResponse: {},
    selectedService: null,
    selectedRequest: null,
    serviceTrie: new Trie(),
    serviceTrieInput: "",
    tabId: uniqid(),
  };
}
