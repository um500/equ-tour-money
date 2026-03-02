export default {
  name: "currencyMarkup",
  title: "Currency Markup",
  type: "document",
  fields: [
    {
      name: "currencyCode",
      title: "Currency Code",
      type: "string",
    },
    {
      name: "markupValue",
      title: "Markup Value",
      type: "number",
    },
    {
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
    },
  ],
};