//@ts-expect-error We get all environment variables set via public/env.js at runtime
export const environment = window['env'] || {};
