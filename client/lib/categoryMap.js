export const categorySlugMap = {
    men: "men's clothing",
    women: "women's clothing",
    jewelery: "jewelery",
    electronics: "electronics",
};

export const getCategoryNameFromSlug = (slug) => categorySlugMap[slug];

export const getSlugFromCategoryName = (name) => {
    const entry = Object.entries(categorySlugMap).find(([, value]) => value === name);
    return entry ? entry[0] : null;
}