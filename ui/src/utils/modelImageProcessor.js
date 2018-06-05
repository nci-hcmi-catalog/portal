/**
 *
 * @param {Array} files - File hits from GraphQL query
 * @returns {Array || false} - Returns either the processed images or false
 */
export default function(files) {
  const images = files.filter(edge => edge.node.file_type.indexOf('image') !== -1);
  return images.length > 0 ? images.map(edge => edge.node) : false;
}
