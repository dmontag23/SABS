import fs from "node:fs";

const STORAGE_ROOT_DIRECTORY = "./data";

export const getItemFromStore = <T>(storeName: string, key: string) => {
  try {
    const fileData = fs.readFileSync(
      `${STORAGE_ROOT_DIRECTORY}/${storeName}/${key}`,
      "utf8"
    );
    return JSON.parse(fileData) as T;
  } catch (error) {
    console.error(
      `There was an error getting key ${key} from the ${storeName} store: `,
      error
    );
  }
};

export const getItemsFromStore = <T>(storeName: string) => {
  try {
    const allKeysInStore = fs
      .readdirSync(`${STORAGE_ROOT_DIRECTORY}/${storeName}`, {
        withFileTypes: true
      })
      .filter(dirent => dirent.isFile())
      .map(dirent => dirent.name);

    return allKeysInStore.map(key => {
      const itemFromStore = getItemFromStore<T>(storeName, key);

      if (!itemFromStore)
        throw Error(
          `getItemFromStore returned undefined when called with key ${key} and store ${storeName}.`
        );

      return itemFromStore;
    });
  } catch (error) {
    console.error(
      `There was an error getting items from the ${storeName} store: `,
      error
    );
  }
};

export const writeItemToStore = <T>(
  storeName: string,
  key: string,
  itemToStore: T
) => {
  try {
    fs.mkdirSync(`${STORAGE_ROOT_DIRECTORY}/${storeName}`, { recursive: true });
    fs.writeFileSync(
      `${STORAGE_ROOT_DIRECTORY}/${storeName}/${key}`,
      JSON.stringify(itemToStore)
    );
    return itemToStore;
  } catch (error) {
    console.error(
      `There was an error writing item with key ${key} to the ${storeName} store: `,
      error
    );
  }
};

export const removeItemFromStore = (storeName: string, key: string) => {
  try {
    fs.rmSync(`${STORAGE_ROOT_DIRECTORY}/${storeName}/${key}`);
  } catch (error) {
    console.error(
      `There was an error removing item with key ${key} from store ${storeName}: `,
      error
    );
  }
};

export const clearAllData = () => {
  try {
    fs.rmSync(STORAGE_ROOT_DIRECTORY, { recursive: true });
  } catch (error) {
    console.error("There was an error clearing all the data: ", error);
  }
};
