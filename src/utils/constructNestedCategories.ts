interface INestedCategory {
  id: number;
  title: string;
  subCategories: INestedCategory[];
}

const constructNestedCategories = (categories: any[], parentId = null) => {
  const nestedCategories: INestedCategory[] = [];
  for (const category of categories) {
    if (category.parentId === parentId) {
      const nestedCategory = {
        id: category.id,
        title: category.title,
        subCategories: constructNestedCategories(categories, category.id),
      };
      nestedCategories.push(nestedCategory);
    }
  }
  return nestedCategories;
};

export default constructNestedCategories;
