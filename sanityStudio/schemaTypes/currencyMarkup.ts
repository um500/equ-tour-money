export default {
  name: "currencyMarkup",
  title: "Currency Markup",
  type: "document",

  fields: [

    {
      name: "currencyCode",
      title: "Currency Code",
      type: "string",
      description: "Example: USD, EUR, AED",

      validation: (Rule: any) =>
        Rule.required().min(3).max(3)
    },

    {
      name: "buyMarkup",
      title: "Buy Markup",
      type: "number",
      description: "Markup added when customer buys currency",

      validation: (Rule: any) =>
        Rule.min(0)
    },

    {
      name: "sellMarkup",
      title: "Sell Markup",
      type: "number",
      description: "Markup applied when customer sells currency",

      validation: (Rule: any) =>
        Rule.min(0)
    },

    {
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true
    }

  ]
};