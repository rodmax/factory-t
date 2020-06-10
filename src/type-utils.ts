export type ExtractDerived<T extends Base, Base> = Pick<T, Exclude<keyof T, keyof Base>>;

/**
 * Right now has no approach found for specifying base type for data objects
 * so simple Object used for this
 */
export type JsonObject = Object;
