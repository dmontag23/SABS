module.exports = {
  arrowParens: "avoid",
  importOrder: [
    "^react$|^react-native$",
    "<THIRD_PARTY_MODULES>",
    "^./[a-zA-Z0-9]",
    "^../[a-zA-Z0-9]",
    "^../../[a-zA-Z0-9]",
    "^../../../[a-zA-Z0-9]",
    "^../../../../[a-zA-Z0-9]",
    "^../../../../../[a-zA-Z0-9]"
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  trailingComma: "none"
};
