export default function dateFilter(value) {
  return new Date(value).toLocaleDateString() || 'Wrong Date';
}