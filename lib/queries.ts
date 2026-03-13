// =============================
// India States (reference-based filtering)
// =============================
export const indiaStatesQuery = `
*[_type == "state" && country->type == "india"] 
| order(name asc) {
  _id,
  name,
  "slug": slug.current
}
`;


// =============================
// International Countries
// =============================
export const internationalCountriesQuery = `
*[_type == "country" && type == "international"] 
| order(name asc) {
  _id,
  name,
  "slug": slug.current,

  "states": *[
    _type == "state" && references(^._id)
  ] | order(name asc) {
    _id,
    name,
    "slug": slug.current
  }
}
`;


// =============================
// Home Tours
// =============================
export const homeToursQuery = `
*[_type == "tour"]
| order(_createdAt desc)[0...6] {
  _id,
  title,
  "slug": slug.current,
  price,
  duration,
  shortDescription,
  mainImage,
  category
}
`;

// =============================
// Currency Markup
// =============================
export const currencyMarkupQuery = `
*[_type == "currencyMarkup" && isActive == true]{
  _id,
  currencyCode,
  buyMarkup,
  sellMarkup
}
`;