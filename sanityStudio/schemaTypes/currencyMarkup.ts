import { defineType, defineField } from "sanity";

export default defineType({

  name: "currencyMarkup",
  title: "Currency Markup",
  type: "document",

  fields: [

    defineField({
      name: "currencyCode",
      title: "Currency Code",
      type: "string",
      description: "Example: USD, EUR, AED",

      validation: Rule =>
        Rule.required()
          .min(3)
          .max(3)
          .uppercase()
    }),

    defineField({
      name: "buyMarkup",
      title: "Buy Markup",
      type: "number",
      description: "Added when customer buys currency",

      validation: Rule =>
        Rule.min(0)
    }),

    defineField({
      name: "sellMarkup",
      title: "Sell Markup",
      type: "number",
      description: "Applied when customer sells currency",

      validation: Rule =>
        Rule.min(0)
    }),

    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true
    })

  ],

  preview: {
    select: {
      title: "currencyCode",
      buy: "buyMarkup",
      sell: "sellMarkup"
    },
    prepare({ title, buy, sell }) {
      return {
        title: title,
        subtitle: `Buy +${buy || 0} | Sell +${sell || 0}`
      };
    }
  }

});