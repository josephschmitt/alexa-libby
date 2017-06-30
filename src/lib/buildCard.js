export default function buildCard(title, image, text) {
  return {
    type: 'Standard',
    title,
    text,
    image
  };
}
