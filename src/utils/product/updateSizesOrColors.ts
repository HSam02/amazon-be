import { Transaction } from "sequelize";

const updateSizesOrColors = async (
  oldIds: number[],
  newIds: number[],
  transaction: Transaction,
  removeFunction: (ids: number[], transaction: Transaction) => Promise<void>,
  addFunction: (ids: number[], transaction: Transaction) => Promise<void>
) => {
  try {
    const removingIds = oldIds.filter((oldId) => !newIds.includes(oldId));
    if (removingIds.length) {
      await removeFunction(removingIds, transaction);
    }

    const addingIds = newIds.filter((newId) => !oldIds.includes(newId));
    if (addingIds.length) {
      await addFunction(addingIds, transaction);
    }
  } catch (error) {
    throw error;
  }
};

export default updateSizesOrColors;
