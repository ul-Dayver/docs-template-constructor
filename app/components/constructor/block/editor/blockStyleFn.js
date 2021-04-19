export default (contentBlock) => {
  const alignment = contentBlock.getData() && contentBlock.getData().get('text-align');
  return `document-constructor-textblock text-block text-${alignment || 'left'}`;
}