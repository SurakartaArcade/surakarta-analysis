// @flow

/**
 * Surakarta objects can be compressed into a smaller, abstract data format. These
 * "handles" are useful when handling very large amounts of data.
 *
 * @interface Handle<Client>
 * @namespace SK.analysis
 */
export type Handle<Client> = number; // eslint-disable-line no-unused-vars

/**
 * Each handle type has a helper API associated with it that can be used work with
 * its data.
 *
 * @interface Helper<HandleType, ClientType>
 * @namespace SK.analysis
 */
export interface Helper<HandleType, ClientType> {
  /**
   * Creates a handle from its object format, which can be later inflated back into
   * an equivalent object.
   *
   * @param {ClientType} client
   * @returns {HandleType}
   */
  createHandle(client: ClientType): HandleType;
  /**
   * Builds a handle by taking the object properties as an argument list rather
   * than an object itself.
   *
   * @returns {HandleType}
   */
  buildHandle: Function;
  /**
   * Expands an handle back into object format.
   *
   * @param {HandleType} handle - handle to expand
   */
  expandHandle(handle: HandleType): ClientType;
  /**
   * Inflates an handle into an existing object.
   *
   * @param {HandleType} handle - handle to inflate
   * @param {ClientType} client - client object to copy values into
   */
  inflateHandle(handle: HandleType, client: ClientType): ClientType;
}
