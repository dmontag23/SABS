import {clearAllMockServerData} from "./utils";

beforeEach(async () => {
  // this is necessary in order to clear async storage before each test
  await device.uninstallApp();
  await clearAllMockServerData();
  await device.installApp();
  await device.launchApp();
});
